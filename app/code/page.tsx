import { toDataURL } from "qrcode";
import { transporter } from "../lib/nodemailer";

function Code() {
  const sendEmail = async () => {
    "use server";
    const src = await toDataURL("EL id del ticket para el usuario");
    const info = await transporter.sendMail({
      from: "Mini-Ticket <admin@miniticket.com>",
      to: "oscar@email.com",
      subject: "Gracias por tu compra",
      // attachDataUrls: true,
      html: `<h1>Hola oscar</h1><br /><p>Este es tu ticket:</p><br /><img src="${src}">`,
      // html: `<h1>Hola oscar</h1><br /><p>Este es tu ticket:</p>`,
    });
    console.log("info =>", info);
    console.log("click");
  };
  return (
    <div>
      <h1>Code</h1>
      <button className="border" onClick={sendEmail}>
        Send email
      </button>
    </div>
  );
}

export default Code;
