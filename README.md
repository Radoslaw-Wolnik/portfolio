# portfolio
portfolio website with capacity to start demo projects to show them of

### How to set porfolio and demo projects (options)
 - a - Use subdomains: Run your portfolio on `portfolio.yourdomain.com` and each demo project on `demo1.yourdomain.com`, `demo2.yourdomain.com`, etc.
 - b - Use a reverse proxy: Set up a reverse proxy (like Nginx) to route requests to the appropriate services based on the URL.

### ToDo
Revoked tokens now in the demo session 
 - update services to store them there
 - update cleanup function to remove it from there (mby)

Chcek how to correctly mount crone.service to server.ts