"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { registerStudent } from "@/lib/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { Phone, AlertCircle, Loader2, CheckCircle, ChevronDown, CreditCard } from "lucide-react"
import { validateImageDimensions } from "@/lib/image-utils"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES, SOCIAL_LINKS } from "@/lib/image-paths"
import { MainNav } from "@/components/main-nav"
import { SCHOOL_CODES, getAvailableSubjects } from "@/lib/registration"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [signatureError, setSignatureError] = useState<string | null>(null)
  const [photoWarning, setPhotoWarning] = useState<string | null>(null)
  const [signatureWarning, setSignatureWarning] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [studentId, setStudentId] = useState("")
  const [schoolSearch, setSchoolSearch] = useState("")
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [showPaymentSection, setShowPaymentSection] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLFormElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    school: "",
    class: "",
    olympiadType: "",
    fullName: "",
    fatherName: "",
    motherName: "",
    fatherMobile: "",
    motherMobile: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    dreamUniversity: "",
    previousScholarship: "no",
    scholarshipDetails: "",
    photo: null as File | null,
    signature: null as File | null,
    paymentNumber: "",
    paymentTransactionId: "",
  })

  // Filter schools based on search
  const filteredSchools = Object.keys(SCHOOL_CODES).filter((school) =>
    school.toLowerCase().includes(schoolSearch.toLowerCase()),
  )

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.school) errors.school = "Please select a school"
    if (!formData.class) errors.class = "Please select a class"
    if (!formData.olympiadType) errors.olympiadType = "Please select an olympiad type"
    if (!formData.fullName) errors.fullName = "Full name is required"
    if (!formData.fatherName) errors.fatherName = "Father's name is required"
    if (!formData.motherName) errors.motherName = "Mother's name is required"
    if (!formData.fatherMobile) errors.fatherMobile = "Father's mobile number is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.gender) errors.gender = "Please select a gender"
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required"
    if (!formData.dreamUniversity) errors.dreamUniversity = "Please select a dream university"

    // Payment validation when payment section is shown
    if (showPaymentSection) {
      if (!formData.paymentNumber) errors.paymentNumber = "bKash payment number is required"
      if (!formData.paymentTransactionId) errors.paymentTransactionId = "Transaction ID is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle school selection
  const handleSchoolSelect = (school: string) => {
    setFormData({ ...formData, school })
    setSchoolSearch(school)
    setShowSchoolDropdown(false)
    setFormErrors((prev) => ({ ...prev, school: undefined }))
  }

  // Handle photo change
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setPhotoError(null)
      setPhotoWarning(null)
      setFormErrors((prev) => ({ ...prev, photo: undefined }))

      const validation = await validateImageDimensions(file, 600, 600, 5)

      if (!validation.valid) {
        setPhotoWarning(`Image should be 600x600 pixels. Current size: ${validation.width}x${validation.height}`)
      }

      setFormData({ ...formData, photo: file })

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setPhotoPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle signature change
  const handleSignatureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setSignatureError(null)
      setSignatureWarning(null)

      const validation = await validateImageDimensions(file, 300, 80, 10)

      if (!validation.valid) {
        setSignatureWarning(`Signature should be 300x80 pixels. Current size: ${validation.width}x${validation.height}`)
      }

      setFormData({ ...formData, signature: file })

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setSignaturePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompleteRegistration = () => {
    // Validate basic form first
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setShowPaymentSection(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()

      // Add all text fields
      formDataToSubmit.append("school", formData.school)
      formDataToSubmit.append("class", formData.class)
      formDataToSubmit.append("olympiadType", formData.olympiadType)
      formDataToSubmit.append("fullName", formData.fullName)
      formDataToSubmit.append("fatherName", formData.fatherName)
      formDataToSubmit.append("motherName", formData.motherName)
      formDataToSubmit.append("fatherMobile", formData.fatherMobile)
      formDataToSubmit.append("motherMobile", formData.motherMobile || "")
      formDataToSubmit.append("address", formData.address)
      formDataToSubmit.append("gender", formData.gender)
      formDataToSubmit.append("dateOfBirth", formData.dateOfBirth)
      formDataToSubmit.append("educationalInstitute", formData.school)
      formDataToSubmit.append("dreamUniversity", formData.dreamUniversity)
      formDataToSubmit.append("previousScholarship", formData.previousScholarship)
      formDataToSubmit.append("scholarshipDetails", formData.scholarshipDetails || "")
      formDataToSubmit.append("paymentNumber", formData.paymentNumber)
      formDataToSubmit.append("paymentTransactionId", formData.paymentTransactionId)

      // Add files
      if (formData.photo) {
        formDataToSubmit.append("photo", formData.photo)
      }

      if (formData.signature) {
        formDataToSubmit.append("signature", formData.signature)
      }

      const result = await registerStudent(formDataToSubmit)

      if (result.success) {
        setRegistrationSuccess(true)
        setRegistrationNumber(result.registrationNumber || "")
        setStudentId(result.studentId || "")

        toast({
          title: "Registration Submitted",
          description: `Your registration has been submitted successfully. Registration number: ${result.registrationNumber}`,
        })
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If registration is successful, show success message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <Image
                  src={IMAGES.LOGO || "/placeholder.svg"}
                  alt="Savar Science Society Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <h1 className="text-xl font-bold">Savar Science Society</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <MainNav />
              <ThemeToggle />
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardHeader className="bg-emerald-600 dark:bg-emerald-700 p-4 flex flex-col items-center justify-center rounded-t-lg">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Registration Submitted</h1>
              </div>
            </CardHeader>

            <CardContent className="p-8 border border-gray-200 dark:border-gray-700 rounded-b-lg dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Thank you for registering!</h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your registration has been submitted and is pending payment verification.
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 mb-6 w-full">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Your Registration Number:</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{registrationNumber}</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6 w-full">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Payment Status:</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Your payment information has been submitted for verification. You will be able to download your
                    admit card once the payment is verified by our admin team.
                  </p>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please save your registration number for future reference.
                </p>

                <div className="flex gap-4">
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    <Link href={`/student/${studentId}`}>View Profile</Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 Savar Science Society. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-emerald-600 dark:bg-emerald-700 text-white py-4 border-b border-emerald-700 dark:border-emerald-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h1 className="text-xl font-bold">Savar Science Society</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-0 shadow-none">
          <CardHeader className="bg-emerald-600 dark:bg-emerald-700 p-4 flex flex-col md:flex-row items-center justify-between rounded-t-lg">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">SAVAR SCIENCE SOCIETY</h1>
              <p className="text-yellow-300 font-semibold">PRESENTS</p>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-2">MATH & SCIENCE OLYMPIAD</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Image
                src={IMAGES.LOGO || "/placeholder.svg"}
                alt="Savar Science Society Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </CardHeader>

          <CardContent className="p-6 border border-gray-200 dark:border-gray-700 rounded-b-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Registration <span className="text-emerald-600 dark:text-emerald-400">Form</span>
              </h3>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* School Selection with Search */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">School/Institution</h4>
                <div className="relative">
                  <Input
                    placeholder="Search and select your school/institution..."
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value)
                      setShowSchoolDropdown(true)
                    }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                  />
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />

                  {showSchoolDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <div
                            key={school}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-700 dark:text-gray-300"
                            onClick={() => handleSchoolSelect(school)}
                          >
                            {school}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">No schools found</div>
                      )}
                    </div>
                  )}
                </div>
                {formErrors.school && <p className="text-red-500 text-xs mt-1">{formErrors.school}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Class</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[5, 6, 7, 8, 9, 10].map((classNum) => (
                      <div key={classNum} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${classNum}`}
                          checked={formData.class === classNum.toString()}
                          onCheckedChange={() => {
                            setFormData({ ...formData, class: classNum.toString() })
                            setFormErrors((prev) => ({ ...prev, class: undefined }))
                          }}
                        />
                        <Label htmlFor={`class-${classNum}`} className="text-gray-700 dark:text-gray-300">
                          {classNum}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.class && <p className="text-red-500 text-xs mt-1">{formErrors.class}</p>}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Olympiad</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.class ? (
                      getAvailableSubjects(formData.class).map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`olympiad-${subject.toLowerCase()}`}
                            checked={formData.olympiadType === subject}
                            onCheckedChange={() => {
                              setFormData({ ...formData, olympiadType: subject })
                              setFormErrors((prev) => ({ ...prev, olympiadType: undefined }))
                            }}
                          />
                          <Label
                            htmlFor={`olympiad-${subject.toLowerCase()}`}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {subject} {subject === "Science" ? "(5-8)" : subject === "Math" ? "(5-10)" : "(9-10)"}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Please select a class first</p>
                    )}
                  </div>
                  {formErrors.olympiadType && <p className="text-red-500 text-xs mt-1">{formErrors.olympiadType}</p>}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="flex justify-end">
                <div className="w-32 h-40 border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 relative">
                  {photoPreview ? (
                    <Image
                      src={photoPreview || "/placeholder.svg"}
                      alt="Student Photo"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
                      Photo
                      <br />
                      (Passport Size)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-32 text-xs"
                  ref={photoInputRef}
                />
                <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">Photo is optional but recommended</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Image should be 600x600 pixels; within 900KB and background should be white
                </p>
                {photoError && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {photoError}
                  </div>
                )}
                {photoWarning && (
                  <div className="flex items-center mt-1 text-amber-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {photoWarning}
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 border-b border-emerald-600 dark:border-emerald-400 pb-1 mb-4">
                  PERSONAL INFORMATION
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
                      Full Name:
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        setFormErrors((prev) => ({ ...prev, fullName: undefined }))
                      }}
                      className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                        formErrors.fullName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fatherName" className="text-gray-700 dark:text-gray-300">
                        Father's Name:
                      </Label>
                      <Input
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => {
                          setFormData({ ...formData, fatherName: e.target.value })
                          setFormErrors((prev) => ({ ...prev, fatherName: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.fatherName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.fatherName && <p className="text-red-500 text-xs mt-1">{formErrors.fatherName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="fatherMobile" className="text-gray-700 dark:text-gray-300">
                        Mobile No:
                      </Label>
                      <Input
                        id="fatherMobile"
                        value={formData.fatherMobile}
                        onChange={(e) => {
                          setFormData({ ...formData, fatherMobile: e.target.value })
                          setFormErrors((prev) => ({ ...prev, fatherMobile: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.fatherMobile ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.fatherMobile && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fatherMobile}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="motherName" className="text-gray-700 dark:text-gray-300">
                        Mother's Name:
                      </Label>
                      <Input
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => {
                          setFormData({ ...formData, motherName: e.target.value })
                          setFormErrors((prev) => ({ ...prev, motherName: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.motherName ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.motherName && <p className="text-red-500 text-xs mt-1">{formErrors.motherName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="motherMobile" className="text-gray-700 dark:text-gray-300">
                        Mobile No:
                      </Label>
                      <Input
                        id="motherMobile"
                        value={formData.motherMobile}
                        onChange={(e) => setFormData({ ...formData, motherMobile: e.target.value })}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                      Present Address:
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value })
                        setFormErrors((prev) => ({ ...prev, address: undefined }))
                      }}
                      className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                        formErrors.address ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 block mb-2">Gender:</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => {
                          setFormData({ ...formData, gender: value })
                          setFormErrors((prev) => ({ ...prev, gender: undefined }))
                        }}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="text-gray-700 dark:text-gray-300">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="text-gray-700 dark:text-gray-300">
                            Female
                          </Label>
                        </div>
                      </RadioGroup>
                      {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth" className="text-gray-700 dark:text-gray-300 block mb-2">
                        Date of Birth:
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                          setFormErrors((prev) => ({ ...prev, dateOfBirth: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.dateOfBirth ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 block mb-2">Dream University:</Label>
                    <RadioGroup
                      value={formData.dreamUniversity}
                      onValueChange={(value) => {
                        setFormData({ ...formData, dreamUniversity: value })
                        setFormErrors((prev) => ({ ...prev, dreamUniversity: undefined }))
                      }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BUET" id="buet" />
                        <Label htmlFor="buet" className="text-gray-700 dark:text-gray-300">
                          Study in BUET
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Medical" id="medical" />
                        <Label htmlFor="medical" className="text-gray-700 dark:text-gray-300">
                          Study in Medical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="General" id="general" />
                        <Label htmlFor="general" className="text-gray-700 dark:text-gray-300">
                          Study in General University (DU,JU etc.)
                        </Label>
                      </div>
                    </RadioGroup>
                    {formErrors.dreamUniversity && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.dreamUniversity}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 block mb-2">
                      Have you previously received a scholarship from any organization?
                    </Label>
                    <RadioGroup
                      value={formData.previousScholarship}
                      onValueChange={(value) => setFormData({ ...formData, previousScholarship: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="scholarship-yes" />
                        <Label htmlFor="scholarship-yes" className="text-gray-700 dark:text-gray-300">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="scholarship-no" />
                        <Label htmlFor="scholarship-no" className="text-gray-700 dark:text-gray-300">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.previousScholarship === "yes" && (
                    <div>
                      <Label htmlFor="scholarshipDetails" className="text-gray-700 dark:text-gray-300">
                        If yes, What was your grade and organization name:
                      </Label>
                      <Input
                        id="scholarshipDetails"
                        value={formData.scholarshipDetails}
                        onChange={(e) => setFormData({ ...formData, scholarshipDetails: e.target.value })}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                  <p className="text-gray-700 dark:text-gray-300 text-center text-sm mb-2">Student Signature</p>
                  <div className="h-20 border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 relative">
                    {signaturePreview ? (
                      <Image
                        src={signaturePreview || "/placeholder.svg"}
                        alt="Student Signature"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 text-xs text-center">Upload Signature</p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="text-xs"
                      ref={signatureInputRef}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      Signature must be 300 x 80 pixels; within 600KB and background should be white
                    </p>
                    <p className="text-amber-500 text-xs mt-1">
                      Signature is optional but recommended for complete registration
                    </p>
                    {signatureError && (
                      <div className="flex items-center mt-1 text-red-500 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {signatureError}
                      </div>
                    )}
                    {signatureWarning && (
                      <div className="flex items-center mt-1 text-amber-500 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {signatureWarning}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                  <p className="text-gray-700 dark:text-gray-300 text-center text-sm mb-2">Register Signature</p>
                  <div className="h-20 border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-700 relative">
                    <Image
                      src={IMAGES.REGISTER_SIGNATURE || "/placeholder.svg"}
                      alt="Register Signature"
                      width={300}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              {showPaymentSection && (
                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Reference
                  </h4>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Please send <span className="font-bold text-blue-600 dark:text-blue-400">150 BDT</span> to our
                      bKash number:
                      <span className="font-bold text-blue-600 dark:text-blue-400"> +880 1518-405600</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Then enter your <span className="font-semibold">payment transaction ID and bKash Number</span>{" "}
                      below for verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentNumber" className="text-gray-700 dark:text-gray-300">
                        bKash Payment Number *
                      </Label>
                      <Input
                        id="paymentNumber"
                        placeholder="Enter your bKash number used for payment"
                        value={formData.paymentNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, paymentNumber: e.target.value })
                          setFormErrors((prev) => ({ ...prev, paymentNumber: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.paymentNumber ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.paymentNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.paymentNumber}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="paymentTransactionId" className="text-gray-700 dark:text-gray-300">
                        Transaction ID *
                      </Label>
                      <Input
                        id="paymentTransactionId"
                        placeholder="Enter bKash transaction ID"
                        value={formData.paymentTransactionId}
                        onChange={(e) => {
                          setFormData({ ...formData, paymentTransactionId: e.target.value })
                          setFormErrors((prev) => ({ ...prev, paymentTransactionId: undefined }))
                        }}
                        className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-700 ${
                          formErrors.paymentTransactionId ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {formErrors.paymentTransactionId && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.paymentTransactionId}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-3">
                    This reference helps us verify your payment quickly and securely.
                  </p>
                </div>
              )}

              {/* Exam Date */}
              <div className="mt-8">
                <p className="text-red-500 font-bold text-center">EXAM DATE: 26 JULY 2025</p>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={IMAGES.FACEBOOK_QR || "/placeholder.svg"}
                    alt="Facebook QR Code"
                    width={100}
                    height={100}
                    className="bg-white p-1 rounded"
                  />
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">☝️Follow on Facebook</p>
                </div>
                <div className="flex flex-col items-center">
                  <Image
                    src={IMAGES.YOUTUBE_QR || "/placeholder.svg"}
                    alt="YouTube QR Code"
                    width={100}
                    height={100}
                    className="bg-white p-1 rounded"
                  />
                  <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">☝️Visit Our Channel</p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                {!showPaymentSection ? (
                  <Button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-2 text-lg rounded-md"
                  >
                    Complete Registration
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-2 text-lg rounded-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>* Payment verification will be done by admin before admit card generation</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-emerald-600 dark:bg-emerald-700 text-white py-8 border-t border-emerald-700 dark:border-emerald-800 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Savar Science Society. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href={SOCIAL_LINKS.FACEBOOK} className="text-white hover:text-white">
              Facebook
            </Link>
            <Link href={SOCIAL_LINKS.YOUTUBE} className="text-white hover:text-white">
              YouTube
            </Link>
          </div>
          <div className="mt-4 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <p>Abu Bakkar Siddique: +8801518405600</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <p>Hujaifa Khan: +8801730903744</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
