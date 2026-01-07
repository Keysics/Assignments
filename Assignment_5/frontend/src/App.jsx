import { useState, useEffect } from 'react'

function App() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [enquiries, setEnquiries] = useState([])
    const [status, setStatus] = useState('')

    // Fetch Enquiries
    const fetchEnquiries = async () => {
        try {
            const res = await fetch('/api/enquiries')
            const data = await res.json()
            if (Array.isArray(data)) {
                setEnquiries(data)
            }
        } catch (err) {
            console.error('Failed to fetch enquiries')
        }
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('Submitting...')

        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setStatus('Submitted successfully!')
                setFormData({ name: '', email: '', message: '' })
                fetchEnquiries() // Refresh list
            } else {
                setStatus('Failed to submit.')
            }
        } catch (err) {
            setStatus('Error submitting form.')
        }
    }

    return (
        <div className="container">
            <header>
                <h1>Contact Us</h1>
                <p>We'd love to hear from you</p>
            </header>

            <div className="content-grid">
                <section className="form-section">
                    <h2>Send an Enquiry</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-submit">Submit Enquiry</button>
                        {status && <p className="status-msg">{status}</p>}
                    </form>
                </section>

                <section className="list-section">
                    <h2>Recent Enquiries (Admin View)</h2>
                    <div className="enquiry-list">
                        {enquiries.length === 0 ? (
                            <p className="empty">No enquiries yet.</p>
                        ) : (
                            enquiries.map(item => (
                                <div key={item._id} className="enquiry-card">
                                    <h3>{item.name}</h3>
                                    <div className="meta">{item.email} • {new Date(item.date).toLocaleDateString()}</div>
                                    <p>{item.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default App
