// Sends contact/enquiry form submissions via Web3Forms, straight to
// hello@triquetraevents.co.in. No custom backend required.
//
// Requires VITE_WEB3FORMS_ACCESS_KEY to be set in .env (see .env.example).

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/**
 * @param {object} fields - arbitrary form fields (name, email, message, ...)
 * @param {object} [options]
 * @param {string} [options.subject] - email subject line
 * @param {string} [options.fromName] - shown as the sender name in the email
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendContactEmail(fields, { subject, fromName } = {}) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    console.error(
      'Missing VITE_WEB3FORMS_ACCESS_KEY. Add your Web3Forms access key to .env before this form can submit.',
    )
    return { success: false, message: 'Email service is not configured.' }
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: subject ?? 'New website enquiry',
        from_name: fromName ?? 'Triquetra Events Website',
        ...fields,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return { success: true, message: data.message ?? 'Sent.' }
    }

    console.error('Web3Forms submission failed:', data)
    return { success: false, message: data.message ?? 'Submission failed.' }
  } catch (err) {
    console.error('Web3Forms submission error:', err)
    return { success: false, message: 'Network error.' }
  }
}
