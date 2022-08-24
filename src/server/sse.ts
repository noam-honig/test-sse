import { Router } from "express";

export const sse = Router();


let connections: clientConnection[] = [];
let open = 0;
let close = 0;

sse.get('/api/stream', (req, res) => {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": req.header('origin') ? req.header('origin') : '',
        "Access-Control-Allow-Credentials": "true",
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    const cc = new clientConnection(res);
    open++;

    connections.push(cc);

    req.on("close", () => {
        cc.close();
        connections = connections.filter(s => s !== cc);
    });
    return cc;
});

sse.get("/api/stats", (req, res) => {
    res.json({
        active: connections.length,
        open,
        close
    })
});
let counter = 0;

setInterval(() => {
    counter++;
    for (const c of connections) {
        c.write(0, counter, "");
    }
}, 900);

class clientConnection {
    close() {
        close++;
        //console.log("close connection");
        this.closed = true;
    }
    closed = false;
    write(id: number, message: any, eventType: string): void {
        this.response.write("event:" + eventType + "\nid:" + id + "\ndata:" + JSON.stringify(message) + "\n\n");
        let r = this.response as any as { flush(): void };
        if (r.flush)
            r.flush();
    }

    constructor(
        public response: import('express').Response
    ) {
        //console.log("open connection");
        this.sendLiveMessage();
    }
    sendLiveMessage() {
        setTimeout(() => {
            if (this.closed)
                return;
            this.response.write("event:keep-alive\ndata:\n\n");
            this.sendLiveMessage();
        }, 45000);
    }
}