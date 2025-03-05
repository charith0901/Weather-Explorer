import { FacebookShareButton, WhatsappShareButton, TwitterShareButton } from 'react-share';
import { FaFacebook, FaWhatsapp, FaTwitter } from 'react-icons/fa';

const ShareButton = ({ location, temperature, description }) => {
    const url = window.location.href; // Current app URL
    const message = `Weather Update: ${location} is currently ${temperature}°C with ${description}.`;

    return (
        <div className="flex space-x-3">
            <FacebookShareButton url={url} quote={message}>
                <FaFacebook className="text-blue-600 text-2xl hover:scale-110 transition" />
            </FacebookShareButton>

            <WhatsappShareButton url={url} title={message}>
                <FaWhatsapp className="text-green-500 text-2xl hover:scale-110 transition" />
            </WhatsappShareButton>

            <TwitterShareButton url={url} title={message}>
                <FaTwitter className="text-blue-400 text-2xl hover:scale-110 transition" />
            </TwitterShareButton>
        </div>
    );
};

export default ShareButton;
