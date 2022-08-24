import { useEffect, useState } from 'react'



function App() {
  const [items, setItems] = useState<string[]>([]);
  const setItem = (what: string) => {
    setItems(items => [what, ...items].splice(0, 20));
  }

  useEffect(() => {
    if (typeof (window) !== 'undefined') {
      if (typeof (EventSource) !== "undefined") {
        let EventSource: any = window['EventSource'];
        function createSource() {
          setItem("open");
          let prefix = '';
          //@ts-ignore
          if (import.meta.env.MODE === 'development')
            prefix = 'http://localhost:3002';
          var source = new EventSource(prefix + '/api/stream', { withCredentials: true });

          source.onmessage = (e: { data: any; }) => {
            setItem(e.data)
          };
          source.onerror = function (e: any) {
            setItem("error")
            console.error(e);
            source.close();
            source = createSource();
          };
          return source;
        }
        var source = createSource();
        return () => {
          setItem("close");
          source.close();
        }
      }
    }






  }, []);

  return (
    <ul>
      {items.map(i => <li key={i}>{i}</li>)}
    </ul>
  )
}

export default App
