<div align="center">
    <h1>SurvivReloadedBot</h1>
    <h3>A custom bot for the Surviv Reloaded Discord server.</h3>
</div>
<br />

<!-- <p align="center">
    <img src="https://img.shields.io/github/v/release/DamienVesper/SurvivReloadedBot?style=for-the-badge&color=f82055&include_prereleases">
    <img src="https://img.shields.io/github/last-commit/DamienVesper/SurvivReloadedBot?style=for-the-badge&color=f82055">
    <img src="https://img.shields.io/github/languages/code-size/DamienVesper/SurvivReloadedBot?style=for-the-badge&color=f82055">
</p>
<br /> -->

## Installation
This project utilizes [pnpm](https://pnpm.io). No other package manager is supported for this project.

To install dependencies for this project, open a command line interface at the directory of the cloned repository, and run:
```sh
pnpm install
```

This will create a `node_modules` directory in that of your project and link the packages there.

## Setup
Testing the application using a database on your own machine will require a localhost database setup:

1. Create a `.env` in the root directory of the repository.
2. Inside of the `.env` file, include the following:
```
# Discord
DISCORD_TOKEN="<discord_application_token>"
DISCORD_ID="<discord_application_id>"
GUILD_ID="<guild_id>"

# Database
MONGODB_URI="<uri>"

# Development mode?
NODE_ENV="production"
```
Replace fields accordingly.

## Development
```
pnpm run dev
```

Note: You will need MongoDB and Node.js installed to be able to run the program.
