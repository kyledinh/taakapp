package com.kalrsn.taak-app

import org.scalatest.FunSuite
import scala.util.Random
import com.kalrsn.taak-app.TaskCache._

class TaskCacheSuite extends FunSuite {

  val original:String = "wongphu"
  val target:String = "wongphu"

  // test encrypt
  test("FlyerCache") {
    println("original" + original)

    assert(original == target)
  }

}
