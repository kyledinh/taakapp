package com.kalrsn.taakapp

import java.sql.Timestamp
import ninthdrug.util.Json.quote
import ninthdrug.util.Util.formatTimestamp

case class User(
  id: Int, 
  user_name: String, 
  user_email: String, 
  active: Boolean
) {
  def json() = {
    "{ " + 
    quote("id") + ":" + id + ", " + 
    quote("user_name") + ":" + quote(user_name) + ", " + 
    quote("user_email") + ":" + quote(user_email) + ", " + 
    quote("active") + ":" + active +
    "} "
  }
}

object User {

  def apply(
    user_name: String, 
    user_email: String, 
    active: Boolean
  ): User = {
    new User(
      0, 
      user_name, 
      user_email, 
      active
    )
  }
}
