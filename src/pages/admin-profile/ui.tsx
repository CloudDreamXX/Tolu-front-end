import { useChangeOwnPasswordMutation } from "entities/admin";
import { Card, Field } from "pages/content-manager/profile";
import { useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";
import { checkPasswordStrength, StrengthMeter } from "shared/lib/utils/passwordChecker";
import { Button, Input } from "shared/ui";

function getStoredUser() {
    try {
        const stored = localStorage.getItem("persist:user");
        if (!stored) return null;

        const parsed = JSON.parse(stored);

        const user = parsed?.user ? JSON.parse(parsed.user) : null;

        return user;
    } catch {
        return null;
    }
}

export const AdminProfile = () => {
    const storedUser = getStoredUser();

    const user = {
        first_name: storedUser?.first_name ?? "",
        last_name: storedUser?.last_name ?? "",
        name: storedUser?.name ?? "",
        email: storedUser?.email ?? ""
    };
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const result = useMemo(
        () => checkPasswordStrength(newPassword),
        [newPassword]
    );

    const [changeOwnPassword] = useChangeOwnPasswordMutation();

    const handleChangePassword = async (oldPass: string, newPass: string) => {
        try {
            await changeOwnPassword({
                old_password: oldPass,
                new_password: newPass
            }).unwrap();

            toast({
                title: "Password successfully changed!",
            });

            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            console.error(err)
            toast({
                variant: "destructive",
                title: "Failed to change password",
                description: "Please try again later.",
            });
        }
    };

    return (
        <div className="p-[16px] md:p-[24px] xl:py-[32px] xl:px-[24px] flex flex-col gap-[24px] md:gap-[32px] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[24px]">
                <Card title="Contact Information & Account Security">
                    <div className="flex flex-col gap-[14px] w-full">
                        <Field
                            className="flex-row"
                            label="Name:"
                            value={user.first_name ? `${user.first_name} ${user.last_name}` : user.name || ""}
                        />
                        <Field
                            className="flex-row"
                            label="Email:"
                            value={user.email || ""}
                        />

                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col gap-[10px]">
                                <p className="text-[16px] font-medium text-[#1D1D1F]">
                                    Current password
                                </p>
                                <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                                    <Input
                                        type={showPassword ? "password" : "text"}
                                        placeholder="Enter Password"
                                        name="password"
                                        value={oldPassword}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value);
                                        }}
                                        className={
                                            "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute mr-4"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword ? "Show password" : "Hide password"
                                        }
                                    >
                                        <MaterialIcon
                                            iconName={
                                                showPassword ? "visibility_off" : "visibility"
                                            }
                                            size={16}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[10px]">
                                <p className="text-[16px] font-medium text-[#1D1D1F]">
                                    New password
                                </p>
                                <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                                    <Input
                                        type={showPassword ? "password" : "text"}
                                        placeholder="Enter Password"
                                        name="password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                        }}
                                        className={
                                            "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute mr-4"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword ? "Show password" : "Hide password"
                                        }
                                    >
                                        <MaterialIcon
                                            iconName={
                                                showPassword ? "visibility_off" : "visibility"
                                            }
                                            size={16}
                                        />
                                    </button>
                                </div>
                                <div className="w-full lg:w-[70%]">
                                    {newPassword && (
                                        <StrengthMeter
                                            level={result.level as 0 | 1 | 2 | 3}
                                            label={result.label}
                                        />
                                    )}

                                    {newPassword && !result.isValid && (
                                        <ul
                                            id="password-help"
                                            className="mt-2 list-disc pl-2 text-xs  text-[#6B7280]"
                                        >
                                            {result.feedback.map((f) => (
                                                <li key={f}>{f}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="brightblue"
                            className="mt-3 w-full md:w-[250px] disabled:opacity-[0.5] disabled:bg-slate-400 disabled:text-slate-900"
                            onClick={() => handleChangePassword(oldPassword, newPassword)}
                            disabled={
                                oldPassword === "" || newPassword === "" || !result.isValid
                            }
                        >
                            Change
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}