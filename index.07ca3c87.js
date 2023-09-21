var e=class{routes=[];mode=null;root="/";constructor(e){this.mode=window.history.pushState?"history":"hash",e.mode&&(this.mode=e.mode),e.root&&(this.root=e.root),this.listen()}add=(e,t)=>(this.routes.push({path:e,cb:t}),this);remove=e=>{for(let t=0;t<this.routes.length;t+=1)if(this.routes[t].path===e){this.routes.slice(t,1);break}return this};flush=()=>(this.routes=[],this);clearSlashes=e=>e.toString().replace(/\/$/,"").replace(/^\//,"");getFragment=()=>{let e="";if("history"===this.mode)e=(e=this.clearSlashes(decodeURI(window.location.pathname+window.location.search))).replace(/\?(.*)$/,""),e="/"!==this.root?e.replace(this.root,""):e;else{let t=window.location.href.match(/(.*)$/);e=t?t[1]:""}return this.clearSlashes(e)};navigate=(e="")=>("history"===this.mode?window.history.pushState(null,null,this.root+this.clearSlashes(e)):window.location.href=`${window.location.href.replace(/(.*)$/,"")}${e}`,this);listen=()=>{clearInterval(this.interval),this.interval=setInterval(this.interval,50)};interval=()=>{this.current!==this.getFragment()&&(this.current=this.getFragment(),this.routes.some(e=>{let t=this.current.match(e.path);return!!t&&(t.shift(),e.cb.apply({},t),t)}))}};async function t(e){let t=sessionStorage.getItem("JWToken"),o=await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({query:`
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
            
            `})}),r=await o.json(),s=r.data.user;(function(e){var t,n,o;let r=document.getElementById("app"),s=document.createElement("h1");r.innerHTML="",s.className="main_header",s.innerHTML="GRAPHQL",r.append(s);let l=document.createElement("div");l.className="container",l.style.marginTop="2%",r.append(l);//user information
let i=document.createElement("div");i.className="basicInformationBlock",l.append(i);let c=e.transactions.filter(e=>"level"===e.type&&!e.path.includes("piscine")&&!e.path.includes("rust")).reduce((e,t)=>t.amount>e.amount?t:e),d=c.path.split("/").reverse()[0];i.innerHTML=`
         <h1>Welcome, ${e.attrs.firstName} ${e.attrs.lastName}</h1>
         <p>${e.attrs.email}</p><p>${e.login}</p>
         <p>Level: ${c.amount}</p>
         <p>Last completed task: ${d}</p>
         <button id="logout" style="margin-left:0;">Logout</button>
        
    `;//audits 
let u=document.createElement("div");u.className="auditsInformationCharts";let p=document.createElement("p");p.innerHTML="Audits ratio";let m=document.createElement("p"),h=Math.round(e.totalUp/e.totalDown*10)/10;console.log(h),h>.4?m.innerHTML=`${h} Almost perfect!`:m.innerHTML=`${h} You are careful buddy.`,h>.4?m.style.color="hsl(170, 100%, 50%)":m.style.color="hsl(340, 100%, 50%)";let g=document.createElement("div");g.style.width="100%",g.append((t=[a(e.totalUp,"MB").amount,a(e.totalDown,"MB").amount],(n=document.createElement("canvas")).setAttribute("id","audit-chart"),(o=["done","received"]).forEach((e,a)=>{o[a]=`${e}: ${t[a]} MB`}),console.log(o),console.log(t),new Chart(n,{type:"bar",data:{labels:o,datasets:[{data:t,backgroundColor:["hsl(170, 100%, 50%)","hsl(0, 0%, 80%)"]}]},options:{indexAxis:"y",responsive:!0,aspectRatio:4,plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(e){let a=e.dataIndex,n=t[a];return o[a],`${n} MB`}}}},scales:{x:{display:!1,beginAtZero:!0// Start the X-axis at 0
},y:{position:"right",grid:{display:!1// Hide the y-axis grid lines
}}},datasets:{bar:{barThickness:10// Adjust the height of the bars
}}}}),n)),u.append(p,g,m);//XPAmount
let f=e.transactions.filter(e=>"xp"===e.type&&!e.path.includes("piscine")&&!e.path.includes("rust")),y=a(f.reduce((e,t)=>e+t.amount,0)),v=document.createElement("div");v.className="xpcount";let b=document.createElement("p");b.innerHTML=`XP ${y.amount} ${y.size}`;let w=document.createElement("div");w.className="graph-container",w.append(function(e){let t=document.createElement("canvas");t.setAttribute("id","chart");var n=e.map(function(e){return{date:new Date(e.createdAt),xp:e.amount,task:e.path.split("/")[e.path.split("/").length-1]}});// Sort the XP data by date in ascending order
n.sort(function(e,t){return e.date-t.date});for(let e=1;e<n.length;e++)n[e].xp+=n[e-1].xp;var o=n.map(function(e){return e.date.toLocaleDateString()}),r=n.map(function(e){return a(e.xp,"KB").amount});return new Chart(t,{type:"line",data:{labels:o,datasets:[{label:"XP Earned",data:r,fill:!1,borderColor:"hsl(260, 100%, 80%)",pointBackgroundColor:"black"}]},options:{responsive:!0,maintainAspectRatio:!1,aspectRatio:1,scales:{y:{beginAtZero:!0// Start the Y-axis at 0
}},plugins:{legend:{display:!1// Hide the legend
},tooltip:{callbacks:{label:function(e){var t=e.dataIndex;return`Amount: ${r[t]}
Task: ${n[t].task}`}}}}}}),t}(f)),v.append(b,w),l.append(u,v)})(s[0]),document.getElementById("logout").addEventListener("click",function(){let t=sessionStorage.getItem("JWToken");null!=t&&void 0!=t&&(sessionStorage.clear(),n(e))})}function a(e,t){let a=["Bytes","KB","MB"];if(0===e)return"0 Byte";var n=-1;n=null!=t?a.indexOf(t):Math.floor(Math.log(e)/Math.log(1e3));let o=parseFloat((e/Math.pow(1e3,n)).toFixed(2));return{amount:o,size:a[n]}}function n(e){let a=sessionStorage.getItem("JWToken");if(null!=a&&void 0!=a){t(e);return}let n=document.getElementById("app");n.innerHTML="";let o=document.createElement("div");o.className="container",n.append(o);let r=document.createElement("div");r.className="content",o.append(r);let s=document.createElement("h2");s.innerHTML="Login",r.append(s);let l=document.createElement("form");l.id="loginForm",r.append(l);let i=document.createElement("input");i.type="text",i.name="username",i.required=!0,i.placeholder="Enter your username";let c=document.createElement("input");c.type="password",c.name="password",c.required=!0,c.placeholder="Enter your password";let d=document.createElement("button");d.type="submit",d.name="username",d.innerHTML="submit",l.append(i,c,d),l.addEventListener("submit",async function(a){a.preventDefault();let n=btoa(`${i.value}:${c.value}`),o=await fetch("https://01.kood.tech/api/auth/signin",{method:"POST",headers:{Authorization:`Basic ${n}`}});if(o.ok){let a=await o.json();sessionStorage.setItem("JWToken",a),t(e)}else 403===o.status?(alert("Incorrect password"),c.value=""):(alert("User doesnt exist"),l.reset())})}const o=new e({mode:"hash",root:"/"});o.add("",()=>{let e=sessionStorage.getItem("JWToken");if(null==e){n(o);return}t(o)});//# sourceMappingURL=index.07ca3c87.js.map

//# sourceMappingURL=index.07ca3c87.js.map
