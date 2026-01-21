
import DOMPurify from 'dompurify';
const safeContent = DOMPurify.sanitize(message.content);
<div dangerouslySetInnerHTML={{__html: safeContent}} />

