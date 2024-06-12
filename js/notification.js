

const alertBtn = document.querySelector("[type='alert']");

alertBtn.addEventListener("click", () => 
{
    Notification.requestPermission().then(perm => 
    {
        if (perm === "granted")
        {
            new Notification("Example Notification...")
        }

        Notification.addEventListener("error", e => 
        {
            alert("error")
        })
    })
})

let notification
document.addEventListener("visibilitychange", () =>
    {
        if (document.visibilityState === 'hidden')
        {
                notification = new Notification("Student Planner has a new notification.")
        }
        else
        {
            if (notification) notification.close()
        }
    }
)

