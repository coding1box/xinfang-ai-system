"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Send, StarsIcon, Settings } from "lucide-react"
import { RiskAssessment } from "@/components/ui/risk-assessment"
import RichTextEditor from "@/components/ui/rich-text-editor"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function Home() {
  const [chatMessage, setChatMessage] = useState("")
  const [activeTab, setActiveTab] = useState("社会关系")
  const [activeDetailTab, setActiveDetailTab] = useState("多维信息")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  type ChatMessage = {
    type: "ai" | "user";
    content: string;
    timestamp: string;
    loading?: boolean;
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "ai",
      content:
        "您好！我是信访AI助手，能为您提供政策咨询、信访流程指导等服务。请详细描述您的需求，我会尽力为您提供帮助。",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [isDeepThinking, setIsDeepThinking] = useState(false)
  const [reportContent, setReportContent] = useState("")

  const samplePetitioners = [
    { name: "张三", gender: "男", age: 45, idCard: "520102197901011234" },
    { name: "张三丰", gender: "男", age: 108, idCard: "520103191601015678" },
    { name: "李四", gender: "男", age: 38, idCard: "520104198601012468" },
    { name: "王五", gender: "女", age: 52, idCard: "520105197201018765" },
    { name: "张三", gender: "女", age: 30, idCard: "520102199401011235" },
  ]

  const socialRelations = [
    { name: "胡允", relation: "母亲", birthDate: "1965年2月", education: "小学", workplace: "xxx单位" },
    { name: "张泽", relation: "父亲", birthDate: "1963年5月", education: "大专", workplace: "xxx单位" },
    { name: "杨云", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "王天", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "王嫂", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "周心", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "潘彬", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "胡小", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "颜伦", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "李易", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "李四", relation: "", birthDate: "", education: "", workplace: "" },
    { name: "王辉", relation: "", birthDate: "", education: "", workplace: "" },
  ]
  const travelInfo = [
    { date: "2025-01-05", destination: "贵阳市", purpose: "医疗就诊", duration: "1天", companion: "妻子" },
    { date: "2024-12-20", destination: "遵义市", purpose: "探亲访友", duration: "3天", companion: "独自" },
    { date: "2024-11-15", destination: "安顺市", purpose: "务工", duration: "15天", companion: "同村村民" },
    { date: "2024-10-08", destination: "贵阳市", purpose: "信访", duration: "2天", companion: "独自" },
    { date: "2024-09-22", destination: "铜仁市", purpose: "参加培训", duration: "5天", companion: "独自" },
    { date: "2024-08-10", destination: "贵阳市", purpose: "信访", duration: "1天", companion: "村民代表" },
  ]
  const relatedInfo = [
    {
      category: "家庭经济状况",
      items: [
        { label: "家庭年收入", value: "约3.5万元" },
        { label: "主要收入来源", value: "农业种植、临时务工" },
        { label: "家庭负债", value: "无重大负债" },
        { label: "住房情况", value: "自建房屋，面积约120平方米" },
      ],
    },
    {
      category: "社会关系",
      items: [
        { label: "村内声誉", value: "一般，为人较为直率" },
        { label: "邻里关系", value: "基本和睦，偶有小摩擦" },
        { label: "参与组织", value: "村民小组成员" },
        { label: "社会活动", value: "较少参与集体活动" },
      ],
    },
    {
      category: "健康状况",
      items: [
        { label: "身体状况", value: "基本健康，有轻微高血压" },
        { label: "精神状态", value: "情绪容易激动，但无精神疾病史" },
        { label: "就医记录", value: "定期在县医院检查" },
        { label: "医疗保险", value: "参加新农合医疗保险" },
      ],
    },
    {
      category: "教育背景",
      items: [
        { label: "受教育程度", value: "初中毕业" },
        { label: "职业技能", value: "农业种植、基础建筑" },
        { label: "培训经历", value: "参加过农业技术培训" },
        { label: "语言能力", value: "普通话一般，主要使用方言" },
      ],
    },
  ]
  const visitHistory = [
    {
      date: "2025-06-01",
      location: "贵州省信访局",
      content:
        "关于土地征收补偿问题的申请，要求重新评估土地价值，提供合理补偿方案。涉及农村集体土地征收，影响多户村民利益。",
    },
    {
      date: "2025-03-22",
      location: "贵州省信访局",
      content: "针对之前土地征收问题的后续跟进，提交了相关证据材料和村民联名申请书，要求政府部门给予明确答复。",
    },
    {
      date: "2024-08-11",
      location: "贵州省信访局",
      content: "首次就土地征收补偿标准过低问题进行信访，反映当地政府征收程序不规范，补偿标准明显低于市场价格。",
    },
  ]
  const tabs = ["社会关系", "出行信息", "相关情况"]
  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      const userMessage = {
        type: "user" as const,
        content: chatMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          type: "ai" as const,
          content: "",
          timestamp: new Date().toLocaleTimeString(),
          loading: true,
        },
      ]);
      setChatMessage("");
      try {
        // 构建包含人员信息的系统提示
        const personnelInfo = `
当前信访人员信息：
姓名：${selectedPerson.name}
性别：${selectedPerson.gender}
年龄：${selectedPerson.age}岁
职业：${selectedPerson.job}
文化程度：${selectedPerson.education}
家庭住址：${selectedPerson.address}
信访情况：${selectedPerson.desc.join('、')}
风险评估：${selectedPerson.desc.join('、')}

社会关系：${selectedPerson.socialRelations.map(p => `${p.name}(${p.relation})`).join('、')}
出行信息：最近出行${selectedPerson.travelInfo.length}次，主要目的为${selectedPerson.travelInfo.map(t => t.purpose).join('、')}
相关情况：${selectedPerson.relatedInfo.map(s => s.category).join('、')}

请基于以上信息，帮助工作人员进一步了解该信访人员的情况，或就相关政策、风险、处置建议等问题提供专业解答。用户是工作人员，不是信访人员本人。
        `;
        // 只传递有实际内容的历史消息，且不包含 loading 消息和初始欢迎语
        const validHistory = messages
          .filter(m => !m.loading && m.content && m.content !== "您好！我是信访AI助手，能为您提供政策咨询、信访流程指导等服务。请详细描述您的需求，我会尽力为您提供帮助。")
          .slice(-10)
        const historyForApi = [
          {
            role: "system",
            content: personnelInfo
          },
          ...validHistory.map(m => ({
            role: m.type === "ai" ? "assistant" : "user",
            content: m.content
          })),
          ...(validHistory.length === 0 ? [{ role: "user", content: chatMessage }] : [])
        ];
        // 使用流式API
        const response = await fetch("https://xfrisk-backend.onrender.com/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: chatMessage,
            history: historyForApi
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          let accumulatedContent = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr.trim() === '[DONE]') {
                  // 流式传输完成
                  setMessages((prev) => {
                    const lastLoadingIdx = prev.findIndex((m) => m.loading);
                    if (lastLoadingIdx !== -1) {
                      const newMessages = [...prev];
                      newMessages[lastLoadingIdx] = {
                        type: "ai" as const,
                        content: accumulatedContent,
                        timestamp: new Date().toLocaleTimeString(),
                      };
                      return newMessages;
                    }
                    return prev;
                  });
                  return;
                }
                try {
                  const data = JSON.parse(dataStr);
                  if (data.content) {
                    accumulatedContent += data.content;
                    // 实时更新消息内容
                    setMessages((prev) => {
                      const lastLoadingIdx = prev.findIndex((m) => m.loading);
                      if (lastLoadingIdx !== -1) {
                        const newMessages = [...prev];
                        newMessages[lastLoadingIdx] = {
                          type: "ai" as const,
                          content: accumulatedContent,
                          timestamp: new Date().toLocaleTimeString(),
                          loading: true,
                        };
                        return newMessages;
                      }
                      return prev;
                    });
                  }
                  if (data.error) {
                    throw new Error(data.error);
                  }
                } catch (e) {
                  console.error('Error parsing stream data:', e);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Stream error:', err);
        setMessages((prev) => {
          const lastLoadingIdx = prev.findIndex((m) => m.loading);
          if (lastLoadingIdx !== -1) {
            const newMessages = [...prev];
            newMessages[lastLoadingIdx] = {
              type: "ai" as const,
              content: "AI服务暂时不可用，请稍后再试。",
              timestamp: new Date().toLocaleTimeString(),
            };
            return newMessages;
          }
          return [
            ...prev,
            {
              type: "ai" as const,
              content: "AI服务暂时不可用，请稍后再试。",
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
        });
      }
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // 不直接 setSearchResults
  }

  // 防抖：用户停止输入1秒后再显示结果
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }
    const handler = setTimeout(() => {
      setSearchResults(samplePetitioners.filter((p) => p.name.includes(searchQuery)))
    }, 1000)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const handleSearchSelect = (person: any) => {
    setSearchQuery(person.name)
    setSearchResults([])
    setIsSearchFocused(false)
    // 切换信访人信息
    if (person.name === "李四") {
      setSelectedPerson(lisiInfo)
    } else {
      setSelectedPerson(zhangsanInfo)
    }
    console.log("Selected person:", person)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchContainerRef])

  // 张三和李四的完整示例信息
  const zhangsanInfo = {
    name: "张三",
    gender: "男",
    age: 30,
    nation: "汉族",
    job: "农民",
    education: "初中",
    address: "贵州省某县某村",
    tags: ["关注对象", "重点关注"],
    desc: [
      "基本信息：张三，男，30岁，汉族，农民，初中文化程度。家住贵州省某县某村，主要从事农业生产。",
      "信访情况：多次就土地征收补偿问题进行信访，反映征收标准过低，要求重新评估。态度较为激动，但未发现违法行为。",
      "风险评估：中等风险，建议加强沟通协调，妥善处理其合理诉求。"
    ],
    socialRelations: [
      { name: "胡允", relation: "母亲", birthDate: "1965年2月", education: "小学", workplace: "xxx单位" },
      { name: "张泽", relation: "父亲", birthDate: "1963年5月", education: "大专", workplace: "xxx单位" },
      { name: "杨云", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "王天", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "王嫂", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "周心", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "潘彬", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "胡小", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "颜伦", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "李易", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "李四", relation: "", birthDate: "", education: "", workplace: "" },
      { name: "王辉", relation: "", birthDate: "", education: "", workplace: "" },
    ],
    travelInfo: [
      { date: "2025-01-05", destination: "贵阳市", purpose: "医疗就诊", duration: "1天", companion: "妻子" },
      { date: "2024-12-20", destination: "遵义市", purpose: "探亲访友", duration: "3天", companion: "独自" },
      { date: "2024-11-15", destination: "安顺市", purpose: "务工", duration: "15天", companion: "同村村民" },
      { date: "2024-10-08", destination: "贵阳市", purpose: "信访", duration: "2天", companion: "独自" },
      { date: "2024-09-22", destination: "铜仁市", purpose: "参加培训", duration: "5天", companion: "独自" },
      { date: "2024-08-10", destination: "贵阳市", purpose: "信访", duration: "1天", companion: "村民代表" },
    ],
    relatedInfo: [
      {
        category: "家庭经济状况",
        items: [
          { label: "家庭年收入", value: "约3.5万元" },
          { label: "主要收入来源", value: "农业种植、临时务工" },
          { label: "家庭负债", value: "无重大负债" },
          { label: "住房情况", value: "自建房屋，面积约120平方米" },
        ],
      },
      {
        category: "社会关系",
        items: [
          { label: "村内声誉", value: "一般，为人较为直率" },
          { label: "邻里关系", value: "基本和睦，偶有小摩擦" },
          { label: "参与组织", value: "村民小组成员" },
          { label: "社会活动", value: "较少参与集体活动" },
        ],
      },
      {
        category: "健康状况",
        items: [
          { label: "身体状况", value: "基本健康，有轻微高血压" },
          { label: "精神状态", value: "情绪容易激动，但无精神疾病史" },
          { label: "就医记录", value: "定期在县医院检查" },
          { label: "医疗保险", value: "参加新农合医疗保险" },
        ],
      },
      {
        category: "教育背景",
        items: [
          { label: "受教育程度", value: "初中毕业" },
          { label: "职业技能", value: "农业种植、基础建筑" },
          { label: "培训经历", value: "参加过农业技术培训" },
          { label: "语言能力", value: "普通话一般，主要使用方言" },
        ],
      },
    ],
    visitHistory: [
      {
        date: "2025-06-01",
        location: "贵州省信访局",
        content:
          "关于土地征收补偿问题的申请，要求重新评估土地价值，提供合理补偿方案。涉及农村集体土地征收，影响多户村民利益。",
      },
      {
        date: "2025-03-22",
        location: "贵州省信访局",
        content: "针对之前土地征收问题的后续跟进，提交了相关证据材料和村民联名申请书，要求政府部门给予明确答复。",
      },
      {
        date: "2024-08-11",
        location: "贵州省信访局",
        content: "首次就土地征收补偿标准过低问题进行信访，反映当地政府征收程序不规范，补偿标准明显低于市场价格。",
      },
    ],
    aiReport: [
      "• 该信访人员属于合理诉求类型，主要关注点为土地征收补偿标准",
      "• 历史信访记录显示其态度相对理性，未出现过激行为",
      "• 建议采取主动沟通策略，邀请相关部门进行面对面协商",
      "• 预计通过合理补偿方案可有效化解矛盾"
    ],
    aiReportTime: "2025-01-09 15:30"
  }

  const lisiInfo = {
    name: "李四",
    gender: "男",
    age: 38,
    nation: "苗族",
    job: "个体经营",
    education: "高中",
    address: "贵州省某县某镇",
    tags: ["普通对象"],
    desc: [
      "基本信息：李四，男，38岁，苗族，个体经营，高中文化程度。家住贵州省某县某镇，经营一家小商铺。",
      "信访情况：主要反映市场摊位管理问题，诉求为降低摊位租金，未发现激烈行为。",
      "风险评估：低风险，建议加强政策宣传，积极回应合理诉求。"
    ],
    socialRelations: [
      { name: "李母", relation: "母亲", birthDate: "1960年3月", education: "初中", workplace: "无" },
      { name: "李父", relation: "父亲", birthDate: "1958年7月", education: "高中", workplace: "无" },
      { name: "李五", relation: "兄弟", birthDate: "1985年1月", education: "初中", workplace: "个体" },
      { name: "李六", relation: "配偶", birthDate: "1987年9月", education: "高中", workplace: "自由职业" },
    ],
    travelInfo: [
      { date: "2025-02-10", destination: "贵阳市", purpose: "进货", duration: "2天", companion: "独自" },
      { date: "2024-11-05", destination: "凯里市", purpose: "探亲", duration: "3天", companion: "家人" },
    ],
    relatedInfo: [
      {
        category: "家庭经济状况",
        items: [
          { label: "家庭年收入", value: "约8万元" },
          { label: "主要收入来源", value: "小商铺经营" },
          { label: "家庭负债", value: "有小额贷款" },
          { label: "住房情况", value: "租住门面房，面积约60平方米" },
        ],
      },
      {
        category: "社会关系",
        items: [
          { label: "邻里关系", value: "和睦，乐于助人" },
          { label: "参与组织", value: "市场商户协会成员" },
          { label: "社会活动", value: "积极参与社区活动" },
        ],
      },
      {
        category: "健康状况",
        items: [
          { label: "身体状况", value: "健康，无重大疾病" },
          { label: "精神状态", value: "乐观开朗" },
          { label: "就医记录", value: "偶有感冒就诊" },
          { label: "医疗保险", value: "参加城镇居民医保" },
        ],
      },
      {
        category: "教育背景",
        items: [
          { label: "受教育程度", value: "高中毕业" },
          { label: "职业技能", value: "商贸管理" },
          { label: "培训经历", value: "参加过市场营销培训" },
          { label: "语言能力", value: "普通话流利，能简单英语交流" },
        ],
      },
    ],
    visitHistory: [
      {
        date: "2025-03-15",
        location: "县市场监督管理局",
        content:
          "反映市场摊位租金上涨过快，要求相关部门给予合理解释和调整。",
      },
      {
        date: "2024-09-10",
        location: "县信访局",
        content: "咨询市场管理政策，表达对摊位分配方式的疑问。",
      },
    ],
    aiReport: [
      "• 该信访人员诉求主要集中在市场经营管理方面",
      "• 历史信访记录显示其表达理性，未有激烈行为",
      "• 建议加强政策宣传，及时回应合理诉求",
      "• 预计通过政策解释和适当调整可化解矛盾"
    ],
    aiReportTime: "2025-03-16 10:20"
  }

  // 当前选中信访人，默认张三
  const [selectedPerson, setSelectedPerson] = useState(zhangsanInfo)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 mr-80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg font-medium text-gray-900">重点关注人员</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchContainerRef}>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="搜索信访人员"
                  className="w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-1" />
                  搜索
                </Button>
              </div>
              {isSearchFocused && searchQuery && (
                <div className="absolute mt-2 w-full rounded-md border bg-white shadow-lg z-50">
                  <Command>
                    <CommandList>
                      {searchResults.length > 0 ? (
                        <CommandGroup heading="搜索结果">
                          {searchResults.map((person) => (
                            <CommandItem
                              key={person.idCard}
                              onSelect={() => handleSearchSelect(person)}
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{person.name}</span>
                                <span className="text-xs text-gray-500">
                                  {person.gender}, {person.age}岁, {person.idCard}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>未找到相关人员</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 mr-80">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              {/* 详情标题 */}
              <h2 className="text-xl font-semibold">信访人员详情: {selectedPerson.name}</h2>
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    "多维信息",
                    "风险评估",
                    "智能专报"
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveDetailTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${
                        activeDetailTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div className="p-6">
              {activeDetailTab === "多维信息" && (
                <div className="flex items-start space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xl">{selectedPerson.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-medium">{selectedPerson.name} {selectedPerson.gender} {selectedPerson.age}岁</h3>
                      {selectedPerson.tags && selectedPerson.tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-yellow-100 text-yellow-800">{tag}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {selectedPerson.desc.map((p, index) => <p key={index}>{p}</p>)}
                    </div>
                  </div>
                </div>
              )}
              {activeDetailTab === "风险评估" && (
                <div className="space-y-4">
                  <RiskAssessment showRiskAssessment={true} />
                </div>
              )}
              {activeDetailTab === "智能专报" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">AI分析报告</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      {selectedPerson.aiReport.map((p, index) => <p key={index}>{p}</p>)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">报告生成时间：{selectedPerson.aiReportTime}</div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">专报内容编辑</h4>
                    <RichTextEditor value={reportContent} onChange={setReportContent} placeholder="请输入专报内容..." />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Tabs and Content with Right Sidebar */}
          {activeDetailTab === "多维信息" && (
            <div className="flex gap-6">
              {/* Tabs Content */}
              <div className="flex-1 bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="p-6">
                  {activeTab === "社会关系" && (
                    <div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">姓名</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">关系</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">出生年月</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">教育程度</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">工作单位</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedPerson.socialRelations.map((person, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{person.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{person.relation}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{person.birthDate}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{person.education}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{person.workplace}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "出行信息" && (
                    <div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">日期</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">目的地</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">出行目的</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">时长</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">同行人员</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedPerson.travelInfo.map((travel, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{travel.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{travel.destination}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{travel.purpose}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{travel.duration}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{travel.companion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "相关情况" && (
                    <div className="space-y-6">
                      {selectedPerson.relatedInfo.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">{section.category}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.label}：</span>
                                <span className="text-sm text-gray-600">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Right Sidebar - Visit History Only */}
              <div className="w-80 bg-white border-l border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">上访历史</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedPerson.visitHistory.map((visit, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{visit.date}</span>
                            <span className="text-sm text-gray-500">{visit.location}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{visit.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* AI Chat - Fixed Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col fixed right-0 top-0 h-screen z-50">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="font-semibold">黔灵AI</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.loading
                  ? "bg-blue-100 rounded-lg p-3 flex justify-center items-center min-h-[48px]"
                  : message.type === "ai"
                  ? "bg-blue-50 rounded-lg p-3"
                  : "bg-gray-100 rounded-lg p-3"
              }
            >
              <div className="flex items-start space-x-2 w-full">
                {message.type === "ai" && !message.loading && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                )}
                <div className="flex-1">
                  {message.loading ? (
                    <div className="text-sm text-gray-700">
                      <span>{message.content}</span>
                      {message.content === "" && (
                        <div className="flex items-center justify-center gap-2 text-blue-700 font-medium">
                          <span>正在思考中</span>
                          <span className="inline-block animate-bounce">●</span>
                          <span className="inline-block animate-bounce delay-150">●</span>
                          <span className="inline-block animate-bounce delay-300">●</span>
                        </div>
                      )}
                      {message.content !== "" && (
                        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{message.content}</p>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
            <button
              onClick={() => setIsDeepThinking(!isDeepThinking)}
              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                isDeepThinking ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <StarsIcon className="w-3 h-3" />
              <span>深度思考</span>
            </button>
            <span>0/2000</span>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="请输入你的问题"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="sm" className="px-3" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">内容由黔灵AI生成，无法确保信息完全准确，仅供参考</p>
        </div>
      </div>
    </div>
  )
}
