import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Dashboard/Home'
import LoginForm from './pages/Auth/LoginForm'
import SignUpForm from './pages/Auth/SignUpForm'
import CreatePoll from './pages/Dashboard/CreatePoll'
import MyPolls from './pages/Dashboard/MyPolls'
import Bookmarks from './pages/Dashboard/Bookmarks'
import VotedPoll from './pages/Dashboard/VotedPoll'
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/my-polls" element={<MyPolls />} />
          <Route path="/voted-polls" element={<VotedPoll />} />
          <Route path="/bookmarked-polls" element={<Bookmarks />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          style: {
            fontSize: '13px'
          }
        }}
      />
    </>
  )
}

export default App

const Root = () => {
  // Check if user is authenticated or not
  const isAuthenticated = localStorage.getItem('token')

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
}