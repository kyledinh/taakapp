package com.kalrsn.taakapp

import java.sql._
import ninthdrug.config._
import ninthdrug.sql._
import ninthdrug.util.Base64
import ninthdrug.util.Crypto

object TaskCache {

  private var db: Database = null
  private var _tasks  = List[Task]()
  load()

  def load() {
    val dburl = Config.get("taak.dburl")
    val dbuser = Config.get("taak.dbuser")
    val dbpass = Config.get("taak.dbpassword")
    db = Database(dburl, dbuser, dbpass)

    _tasks = {
      db.list[Task]("SELECT * FROM tasks WHERE active = 't' ") {
        (rs: ResultSet) => Task(
          rs.getInt("id"), 
          rs.getInt("user_id"), 
          rs.getString("google_id"), 
          rs.getString("task_title"), 
          rs.getString("task_type"), 
          rs.getString("task_desc"), 
          rs.getString("task_status"), 
          rs.getTimestamp("date_created"), 
          rs.getTimestamp("date_due"), 
          rs.getTimestamp("date_completed"), 
          rs.getBoolean("active")
        )
      }
    }
  }

  def tasks = _tasks

  def getTask(id: Int): Task = {
    _tasks.find(_.id == id) match {
      case None => throw new java.util.NoSuchElementException(
        "key not found: " + id
      )
      case Some(task) => task
    }
  }

  def hasTask(id: Int): Boolean = {
    _tasks.exists(_.id == id)
  }

  def addTask(task:Task) {
    db.execute(
      "INSERT INTO tasks (user_id, google_id, task_title, task_type, task_desc, task_status, date_created, date_due, date_completed, active ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
task.user_id, task.google_id, task.task_title, task.task_type, task.task_desc, task.task_status, task.date_created, task.date_due, task.date_completed, task.active
    )
    load()
  }

  def updateTask(task:Task) {
    db.execute(
      "UPDATE tasks SET id=? , user_id=? , google_id=? , task_title=? , task_type=? , task_desc=? , task_status=? , date_created=? , date_due=? , date_completed=? , active=?  WHERE id=?" ,task.id, task.user_id, task.google_id, task.task_title, task.task_type, task.task_desc, task.task_status, task.date_created, task.date_due, task.date_completed, task.active, task.id
    )
    load()
  }

  def deleteTask(id: Int) {
    db.delete("DELETE FROM tasks WHERE id=?", id)
    load()
  }
}

