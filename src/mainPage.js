export async function mainPage(router){
    
    const JWToken = sessionStorage.getItem('JWToken');
    if (JWToken === null || JWToken === undefined) {
        router.navigate('/login')
        return
    }

    const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql",{
        method: "POST",
        headers: {
            'Authorization': `Bearer ${JWToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query:`
            {
                user{
                    id
                    login
                    profile
                    attrs
                    totalUp
                    totalDown
                    transactions(order_by: { createdAt: desc }) {
                        id
                        type
                        amount
                        createdAt
                        path
                    }
                }
            }
            
            `
        })
    });
    
    const resp = await response.json()

    const user = resp.data.user

    usersData(user[0])
    let logout = document.getElementById("logout")
    logout.addEventListener("click", function(){
        let JWToken = sessionStorage.getItem("JWToken")
        if (JWToken != null && JWToken != undefined) {
            sessionStorage.clear();
            router.navigate('/login')
        }
    })

}

function usersData(user){
    let app = document.getElementById("app")
    let header = document.createElement("h1")
    header.className = "main_header"
    header.innerHTML = "GRAPHQL"

    app.append(header)
    let container = document.createElement("div")
    container.className = "container"
    container.style.marginTop = 2+'%'
    app.append(container)

    //user information
    let basicInformationBlock = document.createElement("div")
    basicInformationBlock.className = "basicInformationBlock"
    container.append(basicInformationBlock)
    
    const currLevelElement = user.transactions
        .filter(element => element.type === "level" && !element.path.includes("piscine") && !element.path.includes("rust"))
        .reduce((prevElement, currentElement) => {
            return currentElement.amount > prevElement.amount ? currentElement : prevElement;
    });

    const path = currLevelElement.path.split("/").reverse()[0]

    basicInformationBlock.innerHTML = `
         <h1>Welcome, ${user.attrs.firstName} ${user.attrs.lastName}</h1>
         <p>${user.attrs.email}</p><p>${user.login}</p>
         <p>Level: ${currLevelElement.amount}</p>
         <p>Last completed task: ${path}</p>
         <button id="logout" style="margin-left:0;">Logout</button>
        
    `

    

    //audits 
    let studentAuditsCont = document.createElement('div')
    studentAuditsCont.className = 'auditsInformationCharts'
    let AuditRatioLb = document.createElement('p')
    AuditRatioLb.innerHTML = `Audits ratio`
    let userAuditRatio = document.createElement('p')
    let auditR = Math.round((user.totalUp / user.totalDown) * 10) / 10
    console.log(auditR)
    auditR > 0.4 ? userAuditRatio.innerHTML = `${auditR} Almost perfect!` : userAuditRatio.innerHTML = `${auditR} You are careful buddy.`
    auditR > 0.4 ? userAuditRatio.style.color = 'hsl(170, 100%, 50%)' : userAuditRatio.style.color = 'hsl(340, 100%, 50%)'
    let auditGraphCont = document.createElement('div')
    auditGraphCont.style.width = '100%'
    auditGraphCont.append(generateAuditRateGraph([convertBytesToSize(user.totalUp, "MB").amount, convertBytesToSize(user.totalDown, "MB").amount]))
    studentAuditsCont.append(AuditRatioLb, auditGraphCont, userAuditRatio)

    

    //XPAmount
    const xps = user.transactions.filter(element => element.type === "xp" && !element.path.includes("piscine") && !element.path.includes("rust"));
    const sum = convertBytesToSize(xps.reduce((total, element) => total + element.amount, 0));
    

    let studentXpCont = document.createElement('div')
    studentXpCont.className = 'xpcount'
    let userXPAmount = document.createElement('p')
    userXPAmount.innerHTML = `XP ${sum.amount} ${sum.size}`
    let graphCont = document.createElement('div')
    graphCont.className = 'graph-container'
    graphCont.append(generateXPProgressGraph(xps))
    studentXpCont.append(userXPAmount, graphCont)
    

    container.append(studentAuditsCont,studentXpCont)

    

    
}


function generateAuditRateGraph(audits) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'audit-chart');
    var verticalLineData = ['done', 'received'];// Data for the chart
    verticalLineData.forEach((el, i) => {
        verticalLineData[i] = `${el}: ${audits[i]} MB`;
    });
    console.log(verticalLineData)
    console.log(audits)
    var horizontalBarChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: verticalLineData,
            datasets: [{
                data: audits,
                backgroundColor: [
                    'hsl(170, 100%, 50%)', // first bar
                    'hsl(0, 0%, 80%)', // second bar
                ]
            }]
        },
        options: {
            indexAxis: 'y', // Rotate the chart to horizontal layout
            responsive: true, // Make the chart responsive
            aspectRatio: 4,
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let dataIndex = context.dataIndex;
                            let value = audits[dataIndex];
                            let label = verticalLineData[dataIndex];
                            return `${value} MB`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false, 
                    beginAtZero: true // Start the X-axis at 0
                },
                y: {
                    position: 'right',
                    grid: {
                        display: false // Hide the y-axis grid lines
                    }
                }
            },
            datasets: {
                bar: {
                    barThickness: 10 // Adjust the height of the bars
                }
            }
        }
    });
    return canvas
}

function generateXPProgressGraph(xps) {
    let XPprogressChart = document.createElement('canvas');
    XPprogressChart.setAttribute('id', 'chart');
    var xpData = xps.map(function (entity) {
        return {
            date: new Date(entity.createdAt),
            xp: entity.amount,
            task: entity.path.split('/')[entity.path.split('/').length - 1]
        };
    });
    // Sort the XP data by date in ascending order
    xpData.sort(function (a, b) {
        return a.date - b.date;
    });
    for (let i = 1; i < xpData.length; i++) {
        xpData[i].xp += xpData[i - 1].xp;
    }
    var labels = xpData.map(function (data) {
        return data.date.toLocaleDateString(); 
    });
    var data = xpData.map(function (data) {
        return convertBytesToSize(data.xp, "KB").amount;
    });
    var myChart = new Chart(XPprogressChart, {
        type: 'line', 
        data: {
            labels: labels, 
            datasets: [{
                label: 'XP Earned', // Label for the dataset
                data: data, // Y-axis data (XP amounts)
                fill: false, 
                borderColor: 'hsl(260, 100%, 80%)',
                pointBackgroundColor: 'black',
            }]
        },
        options: {
            responsive: true, // Enable responsiveness
            maintainAspectRatio: false,
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true // Start the Y-axis at 0
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var dataIndex = context.dataIndex;
                            var tooltipLabel = data[dataIndex];
                            var taskLabel = xpData[dataIndex].task;
                            return `Amount: ${tooltipLabel}\nTask: ${taskLabel}`;
                        }
                    }
                }
            }
        }
    });
    return XPprogressChart
}

function convertBytesToSize(bytes, size) {
    const sizes = ["Bytes", "KB", "MB"];
    if (bytes === 0) {
        return "0 Byte";
    }
    var i = -1
    size != null ? i = sizes.indexOf(size) : i = Math.floor(Math.log(bytes) / Math.log(1000))
    const convertedValue = parseFloat((bytes / Math.pow(1000, i)).toFixed(2));
    return {
        amount: convertedValue,
        size: sizes[i]
    }
}






