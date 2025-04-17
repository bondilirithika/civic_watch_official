# civic_watch_official 
## Smart Civic Management & Safety System

An AI-powered dual-role mobile platform to streamline civic issue reporting and enhance the safety of field officials.  
Built using **React Native (Expo)**, **Appwrite**, **Twilio**, **Groq API + LLaMA**, and a custom **Random Forest ML model**.

---

## 🧩 Overview

We designed two interconnected apps — one for **Citizens** and another for **Government Officials** — aimed at:

- Improving civic issue visibility and response
- Supporting AI-powered legal guidance for citizens
- Ensuring real-time safety monitoring of officials on duty

Inspired by real-life incidents involving unattended complaints and unsafe working conditions, our system uses **AI**, **ML**, and **real-time alerts** to create a socially impactful solution.

---

## 📱 Citizen App Features

- **📝 Lodge Complaints**: Report issues like potholes, noise, crime, and public infrastructure concerns.
- **🔍 Track Status**: Monitor live updates and resolution progress of submitted complaints.
- **👍 Upvote Complaints**: Crowd-prioritize issues by upvoting others' complaints.
- **🔐 Authentication**: Seamless and secure login via Appwrite Auth.
- **🤖 AI Legal Chatbot**:
  - Integrated with **Groq + LLaMA**
  - Answers legal rights and policy questions
  - Responds in under **5 seconds**
  - Acts as a legal support assistant for citizens
- **📱 Built with React Native + Expo** for fast, cross-platform UI performance.

---

## 🧑‍💼 Officials App Features

- **📂 View & Accept Complaints**: Filter and handle tasks based on relevance.
- **🛠️ Resolution Progress**: Update and close complaints once resolved.
- **⚠️ Risk Classification**:
  - Custom-built **Random Forest model**
  - Automatically labels complaints as **Low / Medium / High Risk**
  - Enables effective prioritization and better preparation
- **🆘 Field Safety System**:
  - Periodic **SOS pings** sent to officials on active tasks
  - If unanswered in **2–5 minutes**, an **emergency alert** with **live location** is sent via **Twilio SMS**
  - Aims to protect officials dealing with potentially risky situations

---

## 🧠 Tech Stack

| Layer         | Tools Used                          |
|---------------|-------------------------------------|
| Frontend      | React Native (Expo)                 |
| Backend       | Appwrite (Auth + Database)          |
| ML Model      | Random Forest (Risk Classification) |
| AI Chatbot    | Groq API + LLaMA                    |
| Geolocation   | Expo Location API                   |
| Messaging     | Twilio SMS                          |
| Database      | Appwrite Cloud DB                   |

---

## 🌟 What Makes It Stand Out

- ⚖️ **Legal AI Chatbot** that empowers citizens with real-time knowledge of their rights.
- 📢 **Crowd-Powered Prioritization** through public upvotes.
- 🧠 **Risk-Aware Task Assignment** using intelligent ML classification.
- 🛡️ **Official Safety System** with live geolocation-based SOS triggers.
- ⏱️ **Sub-5s Latency** for AI responses via Groq API.
- 🔐 **Secure & Scalable** architecture using modern, open-source technologies.


---

## 💡 Future Enhancements

- 📈 Admin dashboard for analytics and insights
- 🗂️ Category-based filtering and search for complaints
- 🌐 Multi-language chatbot support
- 🏆 Gamification for citizens (badges/rewards for civic engagement)

---

