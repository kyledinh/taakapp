package com.kalrsn.taakapp

import java.sql.Timestamp
import ninthdrug.util.Json.quote
import ninthdrug.util.Util.formatTimestamp

case class Task(
  id: Int, 
  user_id: Int, 
  google_id: String, 
  task_title: String, 
  task_type: String, 
  task_desc: String, 
  task_status: String, 
  date_created: Timestamp, 
  date_due: Timestamp, 
  date_completed: Timestamp, 
  active: Boolean
) {
  def json() = {
    "{ " + 
    quote("id") + ":" + id + ", " + 
    quote("user_id") + ":" + user_id + ", " + 
    quote("google_id") + ":" + quote(google_id) + ", " + 
    quote("task_title") + ":" + quote(task_title) + ", " + 
    quote("task_type") + ":" + quote(task_type) + ", " + 
    quote("task_desc") + ":" + quote(task_desc) + ", " + 
    quote("task_status") + ":" + quote(task_status) + ", " + 
    quote("date_created") + ":" + quote(formatTimestamp(date_created)) + ", " + 
    quote("date_due") + ":" + quote(formatTimestamp(date_due)) + ", " + 
    quote("date_completed") + ":" + quote(formatTimestamp(date_completed)) + ", " + 
    quote("active") + ":" + active +
    "} "
  }
}

object Task {

  def apply(
    user_id: Int, 
    google_id: String, 
    task_title: String, 
    task_type: String, 
    task_desc: String, 
    task_status: String, 
    date_created: Timestamp, 
    date_due: Timestamp, 
    date_completed: Timestamp, 
    active: Boolean
  ): Task = {
    new Task(
      0, 
      user_id, 
      google_id, 
      task_title, 
      task_type, 
      task_desc, 
      task_status, 
      date_created, 
      date_due, 
      date_completed, 
      active
    )
  }
}
