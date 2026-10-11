import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import brand from "../brand.config.js";
import { gsap, EASE_STATE } from "../lib/motion.js";
import useMotionMode, { dur, travel } from "../hooks/useMotionMode.js";
import { useSchedule } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { AlertIcon, ArrowIcon, CheckIcon, PhoneIcon } from "./Icons.jsx";
import useIsoLayoutEffect from "../hooks/useIsoLayoutEffect.js";

const { form: formCfg } = brand;
const THIS_YEAR = new Date().getFullYear();
const INSPECTION = "Real estate inspection";
const EMERGENCY = formCfg.serviceTypes.find((s) => s.startsWith("Emergency"));
const STEPS = ["What do you need?", "About the property", "How do we reach you?"];

const inputCls =
  "w-full min-h-13 rounded-xl border-[1.5px] border-meadow/35 bg-meadow/[0.06] px-4 py-3 text-meadow placeholder:text-meadow/55 hover:border-meadow/60 aria-[invalid=true]:border-meadow aria-[invalid=true]:border-2";
const labelCls = "label mb-2.5 block text-meadow/80";

function Chip({ name, value, register, type = "radio" }) {
  return (
    <label className="relative cursor-pointer">
      <input type={type} value={value} {...register(name)} className="peer absolute inset-0 opacity-0" />
      <span className="flex min-h-12 items-center gap-2 rounded-full border-[1.5px] border-meadow/35 px-4 py-2.5 font-semibold leading-tight transition-colors duration-200 hover:border-meadow/70 peer-checked:border-amber peer-checked:bg-amber peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-amber [&>svg]:hidden peer-checked:[&>svg]:block">
        <CheckIcon size={16} />
        {value}
      </span>
    </label>
  );
}

function FieldError({ error, id }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-2 text-[0.9375rem] font-semibold text-meadow">
      <AlertIcon size={16} /> {error.message}
    </p>
  );
}

export default function Schedule() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const { request } = useSchedule();
  const mode = useMotionMode();
  const stepRef = useRef(null);
  const headingRef = useRef(null);
  const prev = useRef({ step: 0, status: "idle" });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      service: "",
      propertyType: "",
      tankSize: "",
      lastPumped: "",
      urgency: "",
      closingDate: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      bestTime: "Anytime",
      notes: "",
      company: "", // honeypot
    },
  });

  const service = watch("service");
  const isInspection = service === INSPECTION;

  // Pre-select a service when any CTA asks for one.
  useEffect(() => {
    if (!request) return;
    setValue("service", request.service, { shouldValidate: true });
    setStatus("idle");
    setStep(0);
  }, [request, setValue]);

  // Animated step transitions + move focus to the step heading.
  useIsoLayoutEffect(() => {
    if (prev.current.step === step && prev.current.status === status) return;
    prev.current = { step, status };
    if (status === "sending" || status === "error") return;
    headingRef.current?.focus({ preventScroll: true });
    if (mode === "none" || !stepRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepRef.current,
        { x: travel(32, mode), opacity: 0 },
        { x: 0, opacity: 1, duration: dur(0.6, mode), ease: EASE_STATE }
      );
    });
    return () => ctx.revert();
  }, [step, status, mode]);

  const fieldsFor = (s) =>
    s === 0
      ? ["service"]
      : s === 1
        ? ["propertyType", "tankSize", "lastPumped", "urgency", ...(isInspection ? ["closingDate"] : [])]
        : ["name", "phone", "email", "address"];

  const next = async () => {
    if (await trigger(fieldsFor(step))) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    if (data.company) {
      setStatus("done"); // honeypot filled: quietly drop
      return;
    }
    const { company, ...payload } = data;
    setStatus("sending");
    try {
      if (!formCfg.endpoint) {
        console.log("[Fieldstone] Schedule request (no form endpoint configured):", payload);
      } else {
        const res = await fetch(formCfg.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...payload, _subject: `Schedule request: ${payload.service}` }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const err = (name) => ({
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="schedule" aria-labelledby="schedule-title" className="section-y bg-forest text-meadow">
      <div className="container-x page-x grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div>
          <SectionHeading id="schedule-title" tone="dark" eyebrow="Schedule" title={["Let's get you", "on the schedule."]} />
          <ol className="mt-12 flex flex-col gap-7">
            {formCfg.nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="mono pt-0.5 text-meadow/75">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-meadow/80">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-14 border-t border-meadow/20 pt-8">
            <p className="label text-meadow/75">Rather talk to a person?</p>
            <a
              href={`tel:${brand.phoneHref}`}
              className="mono mt-3 inline-flex items-center gap-3 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight hover:underline"
            >
              <PhoneIcon size={28} />
              {brand.phone}
            </a>
            <p className="mt-2 text-meadow/75">{brand.hours}</p>
          </div>
        </div>

        <div>
          <div className="rounded-[1.5rem] border border-meadow/15 bg-meadow/[0.04] p-6 sm:p-10">
            {status === "done" ? (
              <div ref={stepRef} className="py-6" role="status">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-amber text-white">
                  <CheckIcon size={26} />
                </span>
                <h3 ref={headingRef} tabIndex={-1} className="h3 mt-6 !text-[clamp(1.75rem,3vw,2.5rem)] outline-none">
                  You're on our list, {getValues("name").split(" ")[0] || "neighbor"}.
                </h3>
                <p className="mt-4 max-w-[34rem] text-meadow/85">
                  We'll confirm by phone or text within one business hour. If water is backing up right now, don't wait on us:
                  call <a className="mono underline" href={`tel:${brand.phoneHref}`}>{brand.phone}</a>.
                </p>
                <button
                  type="button"
                  className="link-arrow mt-8"
                  onClick={() => {
                    reset();
                    setStep(0);
                    setStatus("idle");
                  }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="form-step-title">
                {/* Progress */}
                <div className="mb-10">
                  <p className="label mb-3 text-meadow/75" aria-live="polite">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <div className="flex gap-2" aria-hidden="true">
                    {STEPS.map((s, i) => (
                      <span
                        key={s}
                        className="h-1 flex-1 rounded-full transition-colors duration-500"
                        style={{ background: i <= step ? "var(--meadow)" : "color-mix(in srgb, var(--meadow) 20%, transparent)" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Honeypot: hidden from people, tempting to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="company">Company website</label>
                  <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
                </div>

                <div ref={stepRef}>
                  <h3
                    id="form-step-title"
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-tight tracking-[-0.02em] outline-none"
                  >
                    {STEPS[step]}
                  </h3>

                  {step === 0 && (
                    <fieldset className="mt-7" aria-describedby={errors.service ? "service-error" : undefined}>
                      <legend className="sr-only">Service needed</legend>
                      <div className="flex flex-wrap gap-2.5">
                        {formCfg.serviceTypes.map((s) => (
                          <Chip
                            key={s}
                            name="service"
                            value={s}
                            register={(n) => register(n, { required: "Pick the closest match, or choose Not sure." })}
                          />
                        ))}
                      </div>
                      <FieldError id="service-error" error={errors.service} />
                      {service === EMERGENCY && (
                        <p className="mt-6 flex items-start gap-3 rounded-xl bg-meadow p-4 font-semibold text-ink">
                          <AlertIcon size={20} className="mt-0.5 shrink-0" />
                          <span>
                            Backing up right now? Calling is fastest:{" "}
                            <a href={`tel:${brand.phoneHref}`} className="mono underline">
                              {brand.phone}
                            </a>
                          </span>
                        </p>
                      )}
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div className="mt-7 grid gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="propertyType" className={labelCls}>
                          Property type
                        </label>
                        <select
                          id="propertyType"
                          className={inputCls}
                          {...register("propertyType", { required: "Choose a property type." })}
                          {...err("propertyType")}
                        >
                          <option value="" className="text-ink">Select one</option>
                          {formCfg.propertyTypes.map((p) => (
                            <option key={p} className="text-ink">{p}</option>
                          ))}
                        </select>
                        <FieldError id="propertyType-error" error={errors.propertyType} />
                      </div>
                      <div>
                        <label htmlFor="tankSize" className={labelCls}>
                          Approximate tank size
                        </label>
                        <select id="tankSize" className={inputCls} {...register("tankSize")}>
                          <option value="" className="text-ink">Don't know</option>
                          {brand.calculator.tankSizes.map((t) => (
                            <option key={t} value={t} className="text-ink">{t.toLocaleString("en-US")} gallons</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="lastPumped" className={labelCls}>
                          Last pumped
                        </label>
                        <select id="lastPumped" className={inputCls} {...register("lastPumped")}>
                          <option value="" className="text-ink">Don't know</option>
                          {Array.from({ length: 12 }, (_, i) => THIS_YEAR - i).map((y) => (
                            <option key={y} className="text-ink">{y}</option>
                          ))}
                          <option className="text-ink">Before {THIS_YEAR - 11}</option>
                        </select>
                      </div>
                      <fieldset className="sm:col-span-2" aria-describedby={errors.urgency ? "urgency-error" : undefined}>
                        <legend className={labelCls}>How soon?</legend>
                        <div className="flex flex-wrap gap-2.5">
                          {["Today", "This week", "Flexible"].map((u) => (
                            <Chip key={u} name="urgency" value={u} register={(n) => register(n, { required: "Let us know how soon." })} />
                          ))}
                        </div>
                        <FieldError id="urgency-error" error={errors.urgency} />
                      </fieldset>
                      {isInspection && (
                        <div className="sm:col-span-2">
                          <label htmlFor="closingDate" className={labelCls}>
                            Closing date
                          </label>
                          <input
                            id="closingDate"
                            type="date"
                            className={`${inputCls} [color-scheme:dark] sm:max-w-[16rem]`}
                            {...register("closingDate", { required: "Add your closing date so we can plan around it." })}
                            {...err("closingDate")}
                          />
                          <FieldError id="closingDate-error" error={errors.closingDate} />
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="mt-7 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelCls}>
                          Name
                        </label>
                        <input
                          id="name"
                          autoComplete="name"
                          className={inputCls}
                          {...register("name", { required: "Tell us your name." })}
                          {...err("name")}
                        />
                        <FieldError id="name-error" error={errors.name} />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelCls}>
                          Phone (required)
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          className={inputCls}
                          {...register("phone", {
                            required: "We need a phone number to confirm your arrival window.",
                            validate: (v) => v.replace(/\D/g, "").length >= 10 || "Enter a 10-digit phone number.",
                          })}
                          {...err("phone")}
                        />
                        <FieldError id="phone-error" error={errors.phone} />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelCls}>
                          Email (optional)
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          className={inputCls}
                          {...register("email", {
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That email doesn't look right." },
                          })}
                          {...err("email")}
                        />
                        <FieldError id="email-error" error={errors.email} />
                      </div>
                      <div>
                        <label htmlFor="bestTime" className={labelCls}>
                          Best time to reach you
                        </label>
                        <select id="bestTime" className={inputCls} {...register("bestTime")}>
                          {["Anytime", "Morning", "Afternoon", "Evening"].map((t) => (
                            <option key={t} className="text-ink">{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className={labelCls}>
                          Service address
                        </label>
                        <input
                          id="address"
                          autoComplete="street-address"
                          className={inputCls}
                          {...register("address", { required: "Add the address where the system is." })}
                          {...err("address")}
                        />
                        <FieldError id="address-error" error={errors.address} />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="notes" className={labelCls}>
                          Anything else? (optional)
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          placeholder="Gate code, where the lids are, what you've noticed…"
                          className={`${inputCls} resize-y`}
                          {...register("notes")}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {status === "error" && (
                  <p role="alert" className="mt-6 rounded-xl bg-meadow p-4 font-semibold text-ink">
                    Something went wrong sending your request. Please call us at{" "}
                    <a className="mono underline" href={`tel:${brand.phoneHref}`}>
                      {brand.phone}
                    </a>
                    .
                  </p>
                )}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                  {step > 0 ? (
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="link-arrow">
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={next} className="btn btn-amber">
                      Continue <ArrowIcon />
                    </button>
                  ) : (
                    <button type="submit" disabled={status === "sending"} className="btn btn-amber disabled:opacity-70">
                      {status === "sending" ? "Sending…" : "Request my appointment"} <ArrowIcon />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {formCfg.calendlyUrl && (
            <div className="mt-10">
              <p className="label mb-4 text-meadow/75">Or pick a time yourself</p>
              <iframe
                src={formCfg.calendlyUrl}
                title="Book a time with Calendly"
                loading="lazy"
                className="h-[700px] w-full rounded-[1.5rem] bg-meadow"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
