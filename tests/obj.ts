enum PRIORITY {
    High=23857,
    Medium,
    Low="LOW"
}

type bug ={
    bugTit: string
    bugDes: string;
    bugID : number;
    priority: PRIORITY
}

let bug1: bug ={
  bugTit: "Login Failed",
    bugDes: "Valid username failes",
    bugID : 763948,
    priority: PRIORITY.Low
}

