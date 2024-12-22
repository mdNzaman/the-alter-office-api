# the-alter-office-api
This is an assiangment for the the alter office.

## Usage
### Using the Application
To use the application, open a browser and navigate to
`https://http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/ping`

To get started with the application, follow these steps:

1. Google sign-in:
Google Sign-In through the browser and use the retrieved token to authenticate requests to other APIs.
    ```bash
    https://http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/auths/google
    ```

2. Navigate into the application directory and access the detailed api specs:
    ```bash
    Will get it from - app/docs/api/api_specs.md
    ```
Now you should be able to access it. 
If you encounter any issues. Feel free to reach me.


### Assumptions/Considerations

This section allows you to explain any assumptions i made during the project, limitations, or any other considerations the user should be aware of.

```markdown
## Assumptions

- The users to first sign in using Google authentication(on browser). The generated token should be used to authenticate subsequent API requests.
- Each long URL and alias will be unique across the entire project. Duplicate long URL and aliases are not allowed.
- Any user can access an alias to be redirected to the corresponding long URL. Currently, the system returns the long URL as a response.
- Analytics will be available to users, showing data for URLs they have shortened or for which they have requested analytics.
- Users can access analytics for their shortened URLs to view data related to those specific links.

