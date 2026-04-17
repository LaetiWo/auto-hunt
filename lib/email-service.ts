import { resend } from "./resend";

const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Auto Hunt <onboarding@resend.dev>";

// const DEV_EMAIL_OVERRIDE =
//   process.env.NODE_ENV === "development"
//     ? "laetitiawong6@gmail.com" // ← votre email Resend
//     : null;

// Après
const DEV_EMAIL_OVERRIDE = process.env.DEV_EMAIL_OVERRIDE ?? null;

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const recipient = DEV_EMAIL_OVERRIDE ?? payload.to;

    console.log("[SENDMAIL] Attempting to send:", {
      from: DEFAULT_FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
    });

    const result = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      ...payload,
      to: recipient,
    });

    console.log("[SENDMAIL] Response:", result);
    return result;
  } catch (error: any) {
    console.error("[SENDMAIL] Error:", error?.message ?? error);
    throw new Error(`Resend email failed: ${error?.message ?? error}`);
  }
}

export const emailService = {
  async sendBookingConfirmation(booking: any) {
    return await sendEmail({
      to: booking.clientEmail,
      subject: `Confirmation de réservation - Auto Hunt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Réservation confirmée !</h1>

          <p>Bonjour ${booking.clientName},</p>

          <p>Votre réservation a été <strong>confirmée</strong>.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Détails de votre réservation</h2>

            <p><strong>Dates :</strong><br>
            Du ${new Date(booking.startDate).toLocaleDateString("fr-FR")} au ${new Date(booking.endDate).toLocaleDateString("fr-FR")}</p>

            <p><strong>Prise en charge :</strong> ${booking.pickupLocation}</p>
            <p><strong>Retour :</strong> ${booking.returnLocation}</p>

            <p><strong>Prix total :</strong> ${new Intl.NumberFormat("fr-MG").format(booking.totalPrice)} Ar</p>
          </div>

          <p>Nous vous enverrons un rappel 24h avant la date de prise en charge.</p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Cordialement,<br>
            L'équipe Auto Hunt
          </p>
        </div>
      `,
    });
  },

  async sendReminderBefore24h(booking: any) {
    return await sendEmail({
      to: booking.clientEmail,
      subject: `Rappel : votre location commence demain`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Rappel : c'est pour bientôt ! 🚗</h1>

          <p>Bonjour ${booking.clientName},</p>

          <p>Votre location commence <strong>demain</strong> !</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date de prise en charge :</strong><br>
            ${new Date(booking.startDate).toLocaleDateString("fr-FR")}</p>

            <p><strong>Lieu :</strong> ${booking.pickupLocation}</p>
          </div>

          <p><strong>N'oubliez pas d'apporter :</strong></p>
          <ul>
            <li>Votre permis de conduire</li>
            <li>Votre pièce d'identité</li>
            <li>Le montant de la caution si nécessaire</li>
          </ul>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Meilleures salutations,<br>
            L'équipe Auto Hunt
          </p>
        </div>
      `,
    });
  },

  async sendReturnReminder(booking: any) {
    return await sendEmail({
      to: booking.clientEmail,
      subject: `Rappel : retour du véhicule demain`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Rappel de retour 🔑</h1>

          <p>Bonjour ${booking.clientName},</p>

          <p>Votre location se termine <strong>demain</strong>.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date de retour :</strong><br>
            ${new Date(booking.endDate).toLocaleDateString("fr-FR")}</p>

            <p><strong>Lieu de retour :</strong> ${booking.returnLocation}</p>
          </div>

          <p><strong>Veuillez :</strong></p>
          <ul>
            <li>Faire le plein du véhicule</li>
            <li>Nettoyer le véhicule</li>
            <li>Vérifier que vous n'avez rien oublié à l'intérieur</li>
          </ul>

          <p>Nous espérons que vous avez passé un excellent moment avec notre véhicule !</p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Cordialement,<br>
            L'équipe Auto Hunt
          </p>
        </div>
      `,
    });
  },

  async sendRentalRequestEmail(data: {
    to: string;
    ownerName: string;
    requesterName: string;
    requesterEmail: string;
    requesterPhone?: string;
    vehicleTitle: string;
    message: string;
    startDate?: string;
    endDate?: string;
    requestUrl: string;
  }) {
    try {
      return await sendEmail({
        to: data.to,
        subject: `Nouvelle demande de location - ${data.vehicleTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Nouvelle demande de location 🚗</h2>

            <p>Bonjour ${data.ownerName},</p>

            <p><strong>${data.requesterName}</strong> souhaite louer votre véhicule <strong>"${data.vehicleTitle}"</strong>.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Détails de la demande :</h3>
              <p><strong>Nom :</strong> ${data.requesterName}</p>
              <p><strong>Email :</strong> ${data.requesterEmail}</p>
              ${data.requesterPhone ? `<p><strong>Téléphone :</strong> ${data.requesterPhone}</p>` : ""}
              ${data.startDate ? `<p><strong>Date de début :</strong> ${new Date(data.startDate).toLocaleDateString("fr-FR")}</p>` : ""}
              ${data.endDate ? `<p><strong>Date de fin :</strong> ${new Date(data.endDate).toLocaleDateString("fr-FR")}</p>` : ""}
              <p><strong>Message :</strong></p>
              <p style="font-style: italic;">"${data.message}"</p>
            </div>

            <a href="${data.requestUrl}"
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Voir la demande
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Vous pouvez accepter ou refuser cette demande depuis votre tableau de bord.<br><br>
              Cordialement,<br>
              L'équipe Auto Hunt
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sending rental request email:", error);
      return null;
    }
  },

  async sendPurchaseInquiryEmail(data: {
    to: string;
    ownerName: string;
    requesterName: string;
    requesterEmail: string;
    requesterPhone?: string;
    vehicleTitle: string;
    message: string;
    requestUrl: string;
  }) {
    try {
      return await sendEmail({
        to: data.to,
        subject: `Nouveau contact pour ${data.vehicleTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Nouveau contact pour votre véhicule 📧</h2>

            <p>Bonjour ${data.ownerName},</p>

            <p><strong>${data.requesterName}</strong> est intéressé par votre véhicule <strong>"${data.vehicleTitle}"</strong>.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Coordonnées :</h3>
              <p><strong>Nom :</strong> ${data.requesterName}</p>
              <p><strong>Email :</strong> ${data.requesterEmail}</p>
              ${data.requesterPhone ? `<p><strong>Téléphone :</strong> ${data.requesterPhone}</p>` : ""}
              <p><strong>Message :</strong></p>
              <p style="font-style: italic;">"${data.message}"</p>
            </div>

            <a href="${data.requestUrl}"
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Répondre
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Vous pouvez répondre directement à cet email ou via votre tableau de bord.<br><br>
              Cordialement,<br>
              L'équipe Auto Hunt
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sending purchase inquiry email:", error);
      return null;
    }
  },

  async sendRequestConfirmedEmail(data: {
    to: string;
    requesterName: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone?: string;
    vehicleTitle: string;
    type: "RENTAL" | "PURCHASE";
    startDate?: string;
    endDate?: string;
    dashboardUrl: string;
  }) {
    try {
      return await sendEmail({
        to: data.to,
        subject: `Demande confirmée - ${data.vehicleTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Demande confirmée</h2>

            <p>Bonjour ${data.requesterName},</p>

            <p>Bonne nouvelle ! <strong>${data.ownerName}</strong> a accepté votre demande pour <strong>"${data.vehicleTitle}"</strong>.</p>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #10b981;">Prochaines étapes :</h3>
              <p><strong>Propriétaire :</strong> ${data.ownerName}</p>
              <p><strong>Email :</strong> ${data.ownerEmail}</p>
              ${data.ownerPhone ? `<p><strong>Téléphone :</strong> ${data.ownerPhone}</p>` : ""}
              ${
                data.type === "RENTAL" && data.startDate
                  ? `
                <p><strong>Date de début :</strong> ${new Date(data.startDate).toLocaleDateString("fr-FR")}</p>
                <p><strong>Date de fin :</strong> ${new Date(data.endDate!).toLocaleDateString("fr-FR")}</p>
              `
                  : ""
              }
              <p style="margin-top: 15px;">
                Nous vous recommandons de contacter le propriétaire pour finaliser les détails.
              </p>
            </div>

            <a href="${data.dashboardUrl}"
               style="display: inline-block; background: #10b981; color: white; padding: 12px 24px;
                      border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Voir mes demandes
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Cordialement,<br>
              L'équipe Auto Hunt
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      return null;
    }
  },
};
