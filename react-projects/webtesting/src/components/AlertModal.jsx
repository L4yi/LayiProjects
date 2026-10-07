import { Link } from "react-router-dom"
import successImage from "../assets/success.jpeg"

export default function AlertModal({...props}) {
    return (
        <>
            <div className="alert-overlay">
                <div className="alert-container">
                    <div className="image-wrapper">
                        <img src={successImage} alt="Success" />
                    </div>
                    <h4>
                        {   props.message}
                    </h4>
                    <Link to={props.redirectLink}>
                        <button className="btn" title="Okay, Thanks">Okay, Thanks</button>
                    </Link>
                </div>

            </div>
        </>
    )
}