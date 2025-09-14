const { pipeline } = require("stream");
const fetch = global.fetch || require("node-fetch");

class ProxyController {
  static async image(req, res) {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "url obrigatória" });

    try {
      new URL(url); // valida URL
    } catch {
      return res.status(400).json({ error: "URL inválida" });
    }

    try {
     // const remote = await fetch(url);
      console.log("[proxy] Requisição para:", url);
const remoteResp = await fetch(url);
console.log("[proxy] Status remoto:", remoteResp.status)
      if (!remoteResp.ok) return res.status(remoteResp.status).end();

      res.set({
        "Content-Type": remoteResp.headers.get("content-type") || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      });

      // stream sem ocupar RAM
      pipeline(remoteResp.body, res, (err) => {
        if (err) {
          console.error("Erro no proxy:", err);
          res.destroy(err);
        }
      });
    } catch (e) {
      console.error("Proxy fail:", e);
      res.status(502).json({ error: "Falha ao buscar imagem" });
    }
  }
}

module.exports = ProxyController;