import { Chip } from "@nextui-org/chip";

type SkillColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | undefined;

type SkillVariant =
  | "solid"
  | "bordered"
  | "light"
  | "flat"
  | "faded"
  | "shadow"
  | "dot"
  | undefined;

export default function Skills() {
  const getRandomColor = (): SkillColor => {
    const colors = [
      "default",
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
    ];
    return colors[Math.floor(Math.random() * colors.length)] as SkillColor;
  };

  const getRandomVariant = (): SkillVariant => {
    const variants = [
      "solid",
      "bordered",
      "light",
      "flat",
      "faded",
      "shadow",
      "dot",
    ];
    return variants[
      Math.floor(Math.random() * variants.length)
    ] as SkillVariant;
  };

  const randomColor = getRandomColor();

  const skills = [
    "Javascript",
    "Typescript",
    "React",
    "Vue",
    "Angular",
    "Firebase",
    "Node.js",
    "Git",
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col gap-2 items-center">
      <h2 className="text-2xl font-bold">Skills</h2>
      <div className="flex flex-wrap gap-2 p-4 items-center justify-center">
        {skills.map((skill) => (
          <Chip key={skill} color={randomColor} variant={getRandomVariant()}>
            {skill}
          </Chip>
        ))}
      </div>
    </div>
  );
}
