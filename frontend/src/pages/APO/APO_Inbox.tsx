import { useEffect, useState } from "react";
import { listMessages, sendMessage } from "../../api";

export default function APO_Inbox() {
  const [mails, setMails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState(""); const [subject, setSubject] = useState(""); const [body, setBody] = useState("");

  useEffect(() => {
    (async () => {
      try { setMails(await listMessages()); } finally { setLoading(false); }
    })();
  }, []);

  const onSend = async () => {
    await sendMessage({ to, subject, body });
    setTo(""); setSubject(""); setBody("");
    setMails(await listMessages());
  };

  if (loading) return <div className="p-6">Loading…</div>;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">APO Inbox</h1>
      <div className="flex gap-2">
        <input className="border px-2 py-1" placeholder="to" value={to} onChange={e=>setTo(e.target.value)} />
        <input className="border px-2 py-1" placeholder="subject" value={subject} onChange={e=>setSubject(e.target.value)} />
        <input className="border flex-1 px-2 py-1" placeholder="body" value={body} onChange={e=>setBody(e.target.value)} />
        <button className="border px-3" onClick={onSend}>Send</button>
      </div>
      <ul className="space-y-2">
        {mails.map(m => (
          <li key={m.id} className="border p-3 bg-white">
            <div className="font-semibold">{m.subject}</div>
            <div className="text-sm text-gray-600">{m.from} — {m.email}</div>
            <div className="text-sm">{m.preview || m.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
