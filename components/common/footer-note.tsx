import { fontSizes, windowHeight } from "@/themes/app.constant"
import React from "react"
import { Text } from "react-native"

export default function FooterNote() {

    return (
        <>
            <Text
                style={{
                    fontSize: fontSizes.FONT14,
                    color: "#888",
                    textAlign: "center",
                    fontFamily: "TT-Octosquares-Medium",
                    marginBottom: windowHeight(0),
                }}
            >
                © {new Date().getFullYear()} Stark OPC Pvt. Ltd. All rights reserved.
            </Text>
        </>
    )

}