export async function mainPage(router){
    let app = document.getElementById("app")
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

    console.log(user)

}