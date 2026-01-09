import React, { Component } from "react";

let notification = null;

class TaskNotification extends Component {

  componentDidMount() {
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications");
      return;
    }

    // DO NOT auto-request permission here
    console.log("Notification permission:", window.Notification.permission);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.value !== this.props.value &&
      this.props.value &&
      this.props.value.length > 0
    ) {
      this.requestAndShow();
    }
  }

  async requestAndShow() {
    if (window.Notification.permission === "default") {
      const permission = await window.Notification.requestPermission();
      if (permission !== "granted") return;
    }

    if (window.Notification.permission === "granted") {
      this.showNotification();
    }
  }

  showNotification() {
    notification = new window.Notification("Task Overdue 🚨", {
      body: `You have ${this.props.value.length} overdue task(s)!`,
      icon: "/Images/ToDoListPic.png",
    });
  }

  render() {
    return null;
  }
}

export default TaskNotification;
