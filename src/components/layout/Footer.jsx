import React from 'react';
import PropTypes from 'prop-types';
import facebookLogo from "../../assets/icons/facebook-logo.png";
import instagramLogo from "../../assets/icons/instagram-logo.png";
import footerBackground from "../../assets/images/footer-bg.jpg"; // Import ảnh nền

const Footer = () => {
    return (
        <footer
            className="bg-gray-800 text-white py-4"
            style={{
                backgroundImage: `url(${footerBackground})`,  // Thêm ảnh nền
                backgroundSize: 'cover',                      // Ảnh nền phủ kín
                backgroundPosition: 'center',                 // Vị trí trung tâm
                backgroundRepeat: 'no-repeat',                // Không lặp lại ảnh nền
            }}
        >
            <div className="container mx-auto text-center">
                <div className="mb-4">
                    <p className="mb-2">&copy; {new Date().getFullYear()} Movie Trailer Web.</p>
                    <ul className="list-none flex justify-center gap-4 mb-4">
                        <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
                <div className="flex justify-center gap-4">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <img src={facebookLogo} alt="Facebook Logo" className="w-8 h-8" />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <img src={instagramLogo} alt="Instagram Logo" className="w-8 h-8" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {    
}
export default Footer;  
