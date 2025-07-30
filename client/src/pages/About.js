import React from "react";
import { useNavigate } from "react-router-dom";
import './About.css';  

const About = () => {
    const navigate = useNavigate();

    const handleHomeClick = (event) => {
        navigate("/Home");
    };

    return (
        <div className="container">
            <div className="nav-buttons">
                <a href="#" className="nav-button home-button" onClick={handleHomeClick}>🏠 Home</a>
            </div>

            <h1 className="title">✨ About Our Wordle ✨</h1>

            <div className="content-section">
                <h2 className="section-title">The Tea ☕</h2>
                <p>Hey bestie! Welcome to our super cool version of Wordle! We took the classic game and made it extra ✨spicy✨ with some fun twists!</p>
            </div>

            <div className="content-section">
                <h2 className="section-title">Why We're Different 💅</h2>
                <ul className="feature-list">
                    <li className="feature-item">
                        <span className="emoji-bullet">🎯</span>
                        Daily hints to keep it stress-free
                    </li>
                    <li className="feature-item">
                        <span className="emoji-bullet">🎁</span>
                        Daily rewards because you deserve it
                    </li>
                    <li className="feature-item">
                        <span className="emoji-bullet">🏆</span>
                        Leaderboard to flex on your friends
                    </li>
                    <li className="feature-item">
                        <span className="emoji-bullet">🎨</span>
                        Aesthetic vibes all day
                    </li>
                </ul>
            </div>

            <div className="content-section">
                <h2 className="section-title">Meet The Squad 🤝</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-emoji">👩‍💻</div>
                        <div className="member-name">Tanisha</div>
                        <div className="member-role">Design Guru</div>
                        <div className="fun-fact">Fur baby fanatic</div>
                    </div>
                    <div className="team-member">
                        <div className="member-emoji">👩‍💻</div>
                        <div className="member-name">Sneha</div>
                        <div className="member-role">Vibe Curator</div>
                        <div className="fun-fact">Lives on Ramen</div>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <h2 className="section-title">No Cap FR FR 💯</h2>
                <p>We made this game with lots of love and maybe a bit too much caffeine. It's giving main character energy, and we're here for it! Slay the word game, bestie! 💅✨</p>
            </div>
        </div>
    );
}

export default About;
