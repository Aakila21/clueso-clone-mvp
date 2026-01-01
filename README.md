# Clueso.io Clone (MVP)

## Overview
This project is a functional MVP clone of Clueso.io, focused on replicating
the platform’s core workflow: authenticated users recording their screen
with audio and downloading the output.

The goal of this project is not pixel-perfect UI replication, but to
demonstrate product understanding, clean engineering, and extensibility.

## Features
- User Signup & Login using Firebase Authentication
- Session management with automatic login state handling
- Secure Logout
- Screen and audio recording using Browser Media APIs
- Video preview after recording
- Download recorded video locally

## Tech Stack
- HTML, CSS, JavaScript
- Firebase Authentication
- Browser MediaRecorder API
- Firebase Hosting (optional)

## Setup Instructions
1. Clone the repository
2. Open the project folder
3. Configure Firebase keys if needed
4. Open `index.html` in a browser
5. Allow screen recording permissions when prompted

## Architecture Overview
Frontend (HTML/CSS/JS)  
→ Firebase Authentication  
→ Browser Media APIs  
→ Local video download  

## Limitations & Future Improvements

### Current Limitations
- Recorded videos are not uploaded or stored on a backend server
- No AI-powered transcription or editing features
- No team collaboration or workspace support

### Future Improvements
- Upload recordings to cloud storage
- AI-based transcription and smart video editing
- User dashboard with recording history
- Team collaboration and sharing features

## Demo
A short video demo is included showcasing the complete user flow:
signup, login, recording, preview, and download.

## Author
Aakila Nifaha A H
