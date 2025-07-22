"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface RiskAssessmentProps {
  showRiskAssessment: boolean
  riskData?: typeof defaultRiskData
  overallScore?: number
}

const defaultRiskData = [
  {
    dimension: "努力程度",
    value: 85,
    maxValue: 100,
    description: "维权持续性和投入度",
    level: "高",
  },
  {
    dimension: "时间跨度",
    value: 72,
    maxValue: 100,
    description: "问题持续时间长度",
    level: "中高",
  },
  {
    dimension: "群访贡献度",
    value: 68,
    maxValue: 100,
    description: "组织集体维权程度",
    level: "中高",
  },
  {
    dimension: "活跃程度",
    value: 45,
    maxValue: 100,
    description: "信访频次和强度",
    level: "中",
  },
  {
    dimension: "偏激程度",
    value: 15,
    maxValue: 100,
    description: "言行激烈程度",
    level: "低",
  },
]

// 计算综合风险分值
const calculateOverallRisk = (data: typeof defaultRiskData) => {
  const weights = {
    努力程度: 0.25,
    时间跨度: 0.2,
    群访贡献度: 0.25,
    活跃程度: 0.2,
    偏激程度: 0.1,
  }

  const weightedSum = data.reduce((sum, item) => {
    const weight = weights[item.dimension as keyof typeof weights] || 0.2
    return sum + item.value * weight
  }, 0)

  return Math.round(weightedSum)
}

const getRiskLevel = (score: number) => {
  if (score >= 80) return { level: "高", color: "red", bgColor: "red-50" }
  if (score >= 60) return { level: "中高", color: "orange", bgColor: "orange-50" }
  if (score >= 40) return { level: "中", color: "yellow", bgColor: "yellow-50" }
  if (score >= 20) return { level: "中低", color: "blue", bgColor: "blue-50" }
  return { level: "低", color: "green", bgColor: "green-50" }
}

// 评估步骤
const assessmentSteps = ["分析信访内容...", "评估维权历史...", "计算活跃程度...", "分析群体影响...", "综合风险评分..."]

export function RiskAssessment({ showRiskAssessment, riskData, overallScore }: RiskAssessmentProps) {
  const [assessmentState, setAssessmentState] = useState<"initial" | "assessing" | "completed">("initial")
  const [currentStep, setCurrentStep] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStartAssessment = () => {
    setAssessmentState("assessing")
    setCurrentStep(0)

    // 模拟评估过程
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= assessmentSteps.length - 1) {
          clearInterval(stepInterval)
          setTimeout(() => {
            setAssessmentState("completed")
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 800)
  }

  const handleResetAssessment = () => {
    setAssessmentState("initial")
    setCurrentStep(0)
  }

  if (!showRiskAssessment) {
    return null
  }

  const data = riskData || defaultRiskData
  const score = overallScore !== undefined ? overallScore : calculateOverallRisk(data)
  const riskInfo = getRiskLevel(score)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center justify-between">
          <span>信访人员分值评估</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          {/* 初始状态 - 显示评估按钮 */}
          {assessmentState === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">点击按钮开始评估信访人员风险分值</p>
              <Button onClick={handleStartAssessment} className="bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="mr-2 h-4 w-4" />
                评估信访人员风险分值
              </Button>
            </motion.div>
          )}
          {/* 评估中状态 - 显示动态效果 */}
          {assessmentState === "assessing" && (
            <motion.div
              key="assessing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">正在评估风险分值</h3>
                <div className="space-y-2">
                  {assessmentSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: index <= currentStep ? 1 : 0.3,
                        x: 0,
                      }}
                      className={`flex items-center justify-center space-x-2 text-sm ${
                        index <= currentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {index < currentStep ? (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : index === currentStep ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>
                {/* 进度条 */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / assessmentSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    评估进度: {Math.round(((currentStep + 1) / assessmentSteps.length) * 100)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {/* 完成状态 - 展示详细内容 */}
          {assessmentState === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* 详情内容同前 */}
              <div className="h-72 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                    {/* 主网格线加粗，径向线淡灰色虚线 */}
                    <PolarGrid stroke="#cbd5e1" strokeWidth={2} gridType="polygon" radialLines={true} />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={props => (
                        <g>
                          <rect x={props.x-32} y={props.y-14} width="64" height="20" rx="8" fill="#f1f5f9" />
                          <text x={props.x} y={props.y+2} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">{props.payload.value}</text>
                        </g>
                      )}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickCount={5}
                      axisLine={false}
                      tickLine={false}
                      strokeDasharray="3 3"
                    />
                    {/* 渐变色定义 */}
                    <defs>
                      <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <radialGradient id="radarFill" cx="50%" cy="50%" r="80%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
                      </radialGradient>
                    </defs>
                    <Radar
                      name="风险分值"
                      dataKey="value"
                      stroke="url(#radarStroke)"
                      fill="url(#radarFill)"
                      fillOpacity={0.4}
                      strokeWidth={3}
                      dot={({ cx, cy, value, index }) => {
                        // 计算顶点坐标
                        const angle = (Math.PI * 2 / data.length) * index - Math.PI / 2;
                        const r = (value / 100) * 100; // 100为最大半径
                        const x = cx + r * Math.cos(angle);
                        const y = cy + r * Math.sin(angle);
                        return (
                          <g key={index}>
                            <circle cx={x} cy={y} r={8} fill="#fff" stroke="#2563eb" strokeWidth={3} />
                            <circle cx={x} cy={y} r={5} fill="#2563eb" />
                            {/* 分值显示 */}
                            <text x={x} y={y-14} textAnchor="middle" fontSize="13" fill="#2563eb" fontWeight="bold">{value}</text>
                          </g>
                        )
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {/* 详细数据展示 */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">{item.dimension}</span>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant="outline"
                            className={`text-xs px-1 py-0.5 ${
                              item.level === "高"
                                ? "text-red-700 border-red-300 bg-red-50"
                                : item.level === "中高"
                                  ? "text-orange-700 border-orange-300 bg-orange-50"
                                  : item.level === "中"
                                    ? "text-yellow-700 border-yellow-300 bg-yellow-50"
                                    : item.level === "中低"
                                      ? "text-blue-700 border-blue-300 bg-blue-50"
                                      : "text-green-700 border-green-300 bg-green-50"
                            }`}
                          >
                            {item.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                    <span className="text-base font-bold text-gray-900 ml-2">{item.value}</span>
                  </div>
                ))}
              </div>
              {/* 综合分值与说明 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">综合分值：</span>
                  <span className="font-bold text-gray-800">{score}/100</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mt-2">
                  {score >= 80
                    ? "信访人维权意愿极强，持续时间长，具有较强的组织能力，需要高度重视并优先处理。"
                    : score >= 60
                      ? "信访人维权意愿较强，问题较为复杂，建议重点关注并积极协调解决。"
                      : score >= 40
                        ? "信访人维权态度适中，问题相对简单，按常规流程处理即可。"
                        : "信访人维权行为相对理性，风险较低，可按标准程序处理。"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
} 