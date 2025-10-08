// Simple markdown-like parser for blog content
export function parseContent(content: string): JSX.Element[] {
  if (!content) return [];

  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      elements.push(<br key={key++} />);
      continue;
    }

    // Videos: @[Title](video_url) - Supports YouTube, Vimeo, direct video URLs
    const videoMatch = line.match(/^@\[(.*?)\]\((.*?)\)$/);
    if (videoMatch) {
      const title = videoMatch[1];
      const videoUrl = videoMatch[2];
      let embedUrl = videoUrl;
      
      // Convert YouTube URLs to embed format
      if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // Convert Vimeo URLs to embed format
      else if (videoUrl.includes('vimeo.com/')) {
        const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      
      elements.push(
        <div key={key++} className="my-8 sm:my-10 md:my-12">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              src={embedUrl}
              title={title}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {title && (
            <p className="text-body-small text-center txt-clr-neutral mt-3 italic">
              {title}
            </p>
          )}
        </div>
      );
      continue;
    }

    // Images: ![Alt text](image_url)
    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const altText = imageMatch[1];
      const imageUrl = imageMatch[2];
      elements.push(
        <div key={key++} className="my-8 sm:my-10 md:my-12">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {altText && (
            <p className="text-body-small text-center txt-clr-neutral mt-3 italic">
              {altText}
            </p>
          )}
        </div>
      );
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-headline-medium sm:text-headline-large mb-4 sm:mb-6 txt-clr-black font-semibold">
          {parseInlineFormatting(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-headline-large sm:text-display-small mb-6 sm:mb-8 txt-clr-black font-semibold">
          {parseInlineFormatting(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-display-small sm:text-display-medium mb-8 sm:mb-10 txt-clr-black font-bold">
          {parseInlineFormatting(line.substring(2))}
        </h1>
      );
    }
    // Lists
    else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="mb-2 txt-clr-neutral">
          {parseInlineFormatting(line.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={key++} className="mb-2 txt-clr-neutral">
          {parseInlineFormatting(line.replace(/^\d+\.\s/, ''))}
        </li>
      );
    }
    // Regular paragraphs
    else {
      elements.push(
        <p key={key++} className="text-body-medium sm:text-body-large leading-relaxed mb-4 sm:mb-6 txt-clr-neutral">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  }

  return elements;
}

function parseInlineFormatting(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let currentText = text;
  let key = 0;

  // Handle golden highlight HTML spans
  currentText = currentText.replace(/<span class="txt-clr-black font-semibold">(.*?)<\/span>/g, (match, content) => {
    const id = `golden-${key++}`;
    parts.push(<span key={id} className="txt-clr-black font-semibold">{content}</span>);
    return `__GOLDEN_PLACEHOLDER_${parts.length - 1}__`;
  });

  // Handle **bold** text
  currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    const id = `bold-${key++}`;
    parts.push(<strong key={id} className="font-semibold txt-clr-black">{content}</strong>);
    return `__BOLD_PLACEHOLDER_${parts.length - 1}__`;
  });

  // Handle *italic* text
  currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
    const id = `italic-${key++}`;
    parts.push(<em key={id} className="italic txt-clr-black">{content}</em>);
    return `__ITALIC_PLACEHOLDER_${parts.length - 1}__`;
  });

  // Split by placeholders and reconstruct
  const textParts = currentText.split(/(__\w+_PLACEHOLDER_\d+__)/);
  
  return textParts.map((part, index) => {
    const placeholderMatch = part.match(/__(\w+)_PLACEHOLDER_(\d+)__/);
    if (placeholderMatch) {
      const placeholderIndex = parseInt(placeholderMatch[2]);
      return parts[placeholderIndex];
    }
    return part;
  }).filter(part => part !== '');
}
