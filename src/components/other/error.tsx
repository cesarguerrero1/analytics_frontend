/**
 * Cesar Guerrero
 * 09/01/23
 * @returns JSX Element for our Error page 404
 */

import { useNavigate } from "react-router-dom"; //Allows us to redirect a users browser

function Error(): JSX.Element{

    const navigate = useNavigate();

    //Go back to the login page after entering an invalid route
    function homeClickHandler(): any{
        navigate('/');
        return
    }

    return(
        <div className="container-fluid min-vh-100 min-vh-100 cg-error-body">
            <div className="row mx-auto justify-content-center align-items-center cg-error-container">
                <div className='text-center cg-error-box'>
                    <h1 className="cg-colorful-writing">404</h1>
                    <p>Oops! Nothing to see here!</p>
                    <button className="btn cg-button" onClick={homeClickHandler}>Return Home</button>
                </div>
            </div>
        </div>
    )
}

export default Error