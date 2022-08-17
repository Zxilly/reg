import type {NextPage} from 'next'
import Head from 'next/head'
import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    type SnackbarCloseReason,
    TextField,
    Typography
} from "@mui/material";
import {type ChangeEvent, useEffect, useState} from "react";
import {emailTest} from "../src/utils";

const Home: NextPage = () => {

    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [helperMessage, setHelperMessage] = useState<string>('请输入您的校园邮箱');
    const [showTip, setShowTip] = useState<boolean>(false);
    const [tipType, setTipType] = useState<'success' | 'error'>('success');
    const [tipMessage, setTipMessage] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        setHelperMessage('请输入您的校园邮箱');
    }, [])

    const handleClose = (event: any, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowTip(false);
    };

    function update(event: ChangeEvent<HTMLTextAreaElement>): void {
        const value = event.target.value.toLowerCase();
        setEmail(() => value);
        const {result, message} = emailTest(value);
        setError(!result);
        setHelperMessage(message);
    }

    function submit() {
        setPending(true);
        fetch('/api/reg', {
            method: 'POST',
            body: email
        }).then((res: Response) => {
            if (res.ok) {
                setTipType('success');
            } else {
                setTipType('error');
            }
            return res.json();
        }).then((data: { message: string }) => {
            setShowTip(true);
            setTipMessage(data.message);
        }).catch(() => {
            setShowTip(true);
            setTipMessage('网络错误');
        }).finally(() => {
            setPending(false);
        })
    }

    return (
        <div>
            <Head>
                <title>Reg</title>
                <meta name="description" content="DIY enter GitHub org."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div style={{
                textAlign: 'center',
            }}>
                <Snackbar open={showTip} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={() => {
                        setShowTip(false)
                    }} severity={tipType}>
                        {tipMessage}
                    </Alert>
                </Snackbar>
                <main className="App">
                    <Card style={{minWidth: 350}}>
                        <CardContent style={{margin: "24px"}}>
                            <Typography gutterBottom variant="h5" component="h2"
                                        className="pb2">注册</Typography>
                            <TextField id="outlined-basic" label="Email" variant="outlined"
                                       value={email}
                                       error={error}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       helperText={helperMessage}
                                       onChange={update}
                                       style={{width: "100%"}} className="pb2"/>
                            <Button variant="contained" disableElevation onClick={submit}>
                                {pending ?
                                    <CircularProgress style={{maxHeight: "24.5px", maxWidth: "24.5px"}}/> : "提交"}
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}

export default Home
