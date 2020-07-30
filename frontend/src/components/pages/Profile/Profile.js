import React from "react"
import "./profile.scss"
import { Hello } from "./components/Hello"
import { ProfileSidebar } from "./components/ProfileSidebar"
import { ProfileContainer } from "./components/ProfileContainer"

export const Profile = () => {
  return (
    <div className='Profile container my-3'>
      <div className='row'>
        <div className='col-lg-3'>
          <Hello />
          <ProfileSidebar />
        </div>
        <div className='col-lg-9'>
          <ProfileContainer />
        </div>
      </div>
    </div>
  )
}
