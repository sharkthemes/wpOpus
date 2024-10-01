export default function TrimText({ text, count }) {
    if ( count == 0 ) return;
    
    let words = text.split(' ');

    if ( words.length > count ) {
        words = words.slice(0, count);
        words = words.join(' ') + "...";
    }
    else {
        words = words.join(' ')
    }
    
    return (
        <p dangerouslySetInnerHTML={{ __html: words }} />
    )
}