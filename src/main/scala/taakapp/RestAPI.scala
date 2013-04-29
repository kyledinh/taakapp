package com.kalrsn.taakapp

object RestAPI {

    def listAllTasks(): String = {
      val tasks = TaskCache.tasks
      tasks.map(_.json).mkString("[ ",",\n"," ]")
    }

}
