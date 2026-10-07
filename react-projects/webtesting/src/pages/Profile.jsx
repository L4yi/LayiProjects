export default function Profile() {
  return (
    <>
      <section className="auth-section">
        <div className="auth-background">
          <div className="overlay-bg">
            <div className="profile-container">
              <div className="profile-wrapper">
                <div className="alert">
                  <div className="alert-success">
                    dY`&lt; <span className="alert-highlight">Hi, welcome to your profile</span>
                  </div>
                </div>

                <div className="profile-detail">
                  <h3>Full Name:</h3>
                  <span id="textfullName"></span>
                </div>

                <div className="profile-detail">
                  <h3>Email:</h3>
                  <span id="textemailAddress"></span>
                </div>

                <div className="profile-detail">
                  <h3>Phone Number:</h3>
                  <span id="textphoneNumber"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
