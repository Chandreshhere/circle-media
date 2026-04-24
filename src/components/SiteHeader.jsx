import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzAbbr = tz.split("/").pop().replace("_", " ");
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + ` [${tzAbbr}]`
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="site-header">
      <div className="site-intro">
        <div className="site-name">
          <p>Circle</p>
          <p className="secondary">Marketing Studio</p>
        </div>
        <div className="site-info">
          <p>{time}</p>
          <p>{date}</p>
        </div>
      </div>
    </div>
  );
}
