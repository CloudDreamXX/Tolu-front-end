import React from "react";

const Error = () => {
  return (
    <>
      <div class="error-header mb-5"> </div>
      <div class="container">
        <section class="error-container text-center">
          <h1 className="mb-4">404</h1>
          <div class="error-divider">
            <h2 style={{ color: "#6f6e6e" }}> PAGE NOT FOUND.</h2>
            <p class="description">We Couldn't Find This Page</p>
          </div>
          <a href="#index.html" class="return-btn mb-5 text-decoration-none">
            <i class="fa fa-home"></i> Home
          </a>
        </section>
      </div>
    </>
  );
};

export default Error;
