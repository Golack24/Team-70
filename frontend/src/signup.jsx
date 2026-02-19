import "./signup.css";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Signup({ onNavigate }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
    }

    try {
      const response = await fetch(
        "http://localhost/metric/public/?resource=users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await.response.json();
      console.log(data);
      
  
  return (
    <>
      <div className="top-promo-bar">
        <span className="top-promo-text">10% OFF WITH CODE 'METRIC'</span>
      </div>
      <Navbar onNavigate={onNavigate} />
      <main className="signup-page">
        <div className="signup-space" />
      </main>
      <Footer />
    </>
  );
}
