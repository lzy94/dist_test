export default function (option, data) {
    return {
        ...option,
        series: [{
            name: '动态站点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data[0],
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAYAAAD6+a2dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDQtMDNUMTA6MDY6NTMrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA0LTAzVDE3OjA0OjE3KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA0LTAzVDE3OjA0OjE3KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI1ODU0M2Q0LTEzNjAtNGY2NC1hODFkLWJkN2JiMWViYmEyZSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYzOTQ0YjI2LTljNWUtZDY0OS05NGE3LTY5MmZhMWMzODM4OCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmFjN2I3ZWEwLTVlZWMtNDNkMi1hMDcwLWU4OWNmZjQ2MDk2ZSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWM3YjdlYTAtNWVlYy00M2QyLWEwNzAtZTg5Y2ZmNDYwOTZlIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTAzVDEwOjA2OjUzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjU4NTQzZDQtMTM2MC00ZjY0LWE4MWQtYmQ3YmIxZWJiYTJlIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTAzVDE3OjA0OjE3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6I4AEhAAAY90lEQVR4nO2dfXxU1bnvv/tlXjOEMWCISJGLHIwpVYoUKYciQowppmlObqTemObQHC6HD+VSj0VFRN70eLjIpRQpl5PaFPnYSNMYY05KY0gpogcRKZd6EKlaSymGgBhDmEzmZe+97h8r4+RlZiAvvFV//8zstdfa69mznvW8rWetUYQQQgi+wOcU6uUm4AtcXnzBAJ9zfMEAn3Pol5uAgYKi7OGpW26fBG0fWoeWPgpakcidNAksjMeuSQGhC6/dDmaV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',
            // symbolSize: function (val) {
            //     console.log(val)
            //     return val[2] / 7.5;
            // },
            symbolSize: 20,
            label: {
                normal: {
                    show: false,
                    position: 'bottom',
                    formatter: '{b}',
                    textStyle: {
                        fontSize: 17
                    }
                },
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    textStyle: {
                        color: '#000',
                        padding: 5,
                        backgroundColor: '#fff'
                    }
                }
            },
            showEffectOn: 'render',
            itemStyle: {
                normal: {
                    color: '#46bee9'
                }
            },
            // label: {
            //     normal: {
            //         show: false,
            //         formatter: function (params) {
            //             // console.log(params);
            //             return params.name;
            //         },
            //         position: 'right',
            //         color: '#fff',
            //         fontSize: '8'
            //     },
            //     emphasis: {
            //         show: false
            //     }
            // },
            // itemStyle: {
            //     normal: {
            //         color: '#4bbbb2',
            //         borderWidth: 2,
            //         borderColor: '#b4dccd'
            //     }
            // }
        }, {
            name: '静态站点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data[1],
            symbol: 'image://data:image/png;base64,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',
            symbolSize: 20,
            label: {
                normal: {
                    show: false,
                    position: 'bottom',
                    formatter: '{b}',
                    textStyle: {
                        fontSize: 17
                    }
                },
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    textStyle: {
                        color: '#000',
                        padding: 5,
                        backgroundColor: '#fff'
                    }
                }
            },
            showEffectOn: 'render',
            itemStyle: {
                normal: {
                    color: '#46bee9'
                }
            },
        }, {
            name: '源头企业',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data[2],
            symbol: 'image://data:image/png;base64,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',
            symbolSize: 20,
            label: {
                normal: {
                    show: false,
                    position: 'bottom',
                    formatter: '{b}',
                    textStyle: {
                        fontSize: 17
                    }
                },
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    textStyle: {
                        color: '#000',
                        padding: 5,
                        backgroundColor: '#fff'
                    }
                }
            },
            showEffectOn: 'render',
            itemStyle: {
                normal: {
                    color: '#46bee9'
                }
            },
        }
        ]
        // series: [{
        //     name: '地点',
        //     type: 'effectScatter',
        //     coordinateSystem: 'geo',
        //     zlevel: 1,
        //     rippleEffect: {
        //         brushType: 'stroke',
        //         period: 5,
        //         scale: 3
        //     },
        //     label: {
        //         normal: {
        //             show: false,
        //             position: 'bottom',
        //             formatter: '{b}',
        //             textStyle: {
        //                 fontSize: 17
        //             }
        //         },
        //         emphasis: {
        //             show: true,
        //             position: 'right',
        //             formatter: '{b}',
        //             textStyle: {
        //                 color: '#000',
        //                 padding: 5,
        //                 backgroundColor: '#fff'
        //             }
        //         }
        //     },
        //     symbolSize: 10,
        //     showEffectOn: 'render',
        //     itemStyle: {
        //         normal: {
        //             color: '#46bee9'
        //         }
        //     },
        //     data: data
        // }]
    }
}