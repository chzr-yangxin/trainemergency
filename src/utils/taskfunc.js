export function GetTaskFunction(type) {
    var FUNC = {
        "1": {
            funcs: [
                {
                    func: "DutyStation",
                    msgs: [
                        { step: 0, msg: "人民广场站6号道岔挤岔报警" },
                        { step: 2, msg: "请求单扳实验" },
                        { step: 6, msg: "道岔正常" },
                    ],
                },
                {
                    func: "RoadWatchman",
                    msgs: [
                        { step: 1, msg: "尝试道岔单扳试验" },
                        { step: 5, msg: "道岔单操操作" },
                    ],
                },
                { func: "PassengerWatchman", msgs: [{ step: 3, msg: "设备故障" }] },
                { func: "StationHall", msgs: [{ step: 4, msg: "道岔故障" }] },
            ],
            txts: [
                "道岔故障",
                "道岔故障",
                "上报道岔故障行调",
                "请求单扳实验",
                "道岔故障",
                "道岔故障",
                "道岔单操操作",
            ]
        },
        "8": {
            funcs: [
                {
                    func: "DutyStation",
                    msgs: [
                        { step: 0, msg: "站台故障应急" },
                        { step: 4, msg: "B站台救援" }
                    ],
                },
                {
                    func: "StationHall",
                    msgs: [
                        { step: 1, msg: "站台故障应急" },
                        { step: 5, msg: "站台故障应急B" }
                    ],
                },
                {
                    func: "PassengerWatchman",
                    msgs: [
                        { step: 2, msg: "站台故障应急" },
                        { step: 6, msg: "站台故障应急B" }
                    ],
                },
                {
                    func: "Platform",
                    msgs: [
                        { step: 3, msg: "B站台故障应急" }
                    ],
                },
                {
                    func: "Over",
                    msgs: [
                        { step: 7, msg: undefined }
                    ],
                }
            ],
            txts: [
                "站台故障应急",
                "站台故障应急",
                "站台故障应急",
                "站台故障应急",
                "B站台进入车厢",
                "B站台救援",
                "站台故障应急B",
                "站台故障应急B"
            ]
        },
        "3": {
            funcs: [
                {
                    func: "DutyStation",
                    msgs: [
                        { step: 0, msg: "售检票系统故障" },
                        { step: 3, msg: "闸机无法释放" },
                        { step: 6, msg: "已通报免检模式" }
                    ],
                },
                {
                    func: "PassengerWatchman",
                    msgs: [
                        { step: 1, msg: "售检票系统故障" },
                        { step: 5, msg: "免检模式" }
                    ],
                },
                {
                    func: "StationHall",
                    msgs: [
                        { step: 2, msg: "售检票系统故障" },
                        { step: 4, msg: "组织应急通道进站" },
                        { step: 7, msg: "售检票系统故障修复完成" }
                    ],
                },
                {
                    func: "Over",
                    msgs: [
                        { step: 8, msg: undefined }
                    ],
                }
            ],
            txts: [
                "售检票系统故障", "售检票系统故障", "售检票系统故障", "上报仍然故障", "闸机无法释放", "组织应急通道出站", "免检", "修复完成", "已修复故障", 
            ]
        },
        "4": {
            funcs: [],
            txts: [
            ]
        },
        "5": {
            funcs: [],
            txts: [
            ]
        },
        "6": {
            funcs: [],
            txts: [
            ]
        },
        "7": {
            funcs: [],
            txts: [
            ]
        },
        "2": {
            funcs: [],
            txts: [
            ]
        },
        "9": {
            funcs: [],
            txts: [
            ]
        }
    }

    return FUNC[type + '']
}