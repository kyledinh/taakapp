package com.kalrsn.taakapp

import java.sql._
import ninthdrug.config._
import ninthdrug.sql._
import ninthdrug.util.Base64
import ninthdrug.util.Crypto

object UserCache {

  private var db: Database = null
  private var _users  = List[User]()
  load()

  def load() {
    val dburl = Config.get("taak.dburl")
    val dbuser = Config.get("taak.dbuser")
    val dbpass = Config.get("taak.dbpassword")
    db = Database(dburl, dbuser, dbpass)

    _users = {
      db.list[User]("SELECT * FROM users WHERE active = 't' ") {
        (rs: ResultSet) => User(
          rs.getInt("id"), 
          rs.getString("user_name"), 
          rs.getString("user_email"), 
          rs.getBoolean("active")
        )
      }
    }
  }

  def users = _users

  def getUser(id: Int): User = {
    _users.find(_.id == id) match {
      case None => throw new java.util.NoSuchElementException(
        "key not found: " + id
      )
      case Some(user) => user
    }
  }

  def hasUser(id: Int): Boolean = {
    _users.exists(_.id == id)
  }

  def addUser(user:User) {
    db.execute(
      "INSERT INTO users (user_name, user_email, active ) VALUES (?, ?, ?)", 
user.user_name, user.user_email, user.active
    )
    load()
  }

  def updateUser(user:User) {
    db.execute(
      "UPDATE users SET id=? , user_name=? , user_email=? , active=?  WHERE id=?" ,user.id, user.user_name, user.user_email, user.active, user.id
    )
    load()
  }

  def deleteUser(id: Int) {
    db.delete("DELETE FROM users WHERE id=?", id)
    load()
  }
}

