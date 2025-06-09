import React, { useState } from "react";
import './style.css';

function GraphConfigPanel({ graphKey, config, availableData, selectedItems, setSelectedItems, handleCheckboxChange }) {
    const { activities, agents, entities } = availableData;
    const selected = selectedItems[graphKey] || { activities: [], agents: [], entities: [], image: { type: "url", source: "" } };

    const [imageType, setImageType] = useState(selected.image?.type || "url");
    const [imageSource, setImageSource] = useState(selected.image?.source || "");

    const renderCheckboxGroup = (label, data, type) => (
        <fieldset className="checkbox-grid scrollable">
            <legend>{label}</legend>
            {data.map((item, index) => (
                <label key={`${graphKey}-${type}-${index}`}>
                    <input
                        type="checkbox"
                        value={item.name}
                        checked={selected[type].includes(item.name)}
                        onChange={(e) => {
                            const updated = { ...selected };
                            handleCheckboxChange(e, updated[type], (newList) => {
                                updated[type] = newList;
                                setSelectedItems((prev) => ({ ...prev, [graphKey]: updated }));
                            });
                        }}
                    />
                    {item.name}
                </label>
            ))}
        </fieldset>
    );

    const handleImageChange = (type, value) => {
        const updated = { ...selected, image: { type, source: value } };
        setSelectedItems((prev) => ({ ...prev, [graphKey]: updated }));
    };

    return (
        <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #ccc' }}>
            {activities && renderCheckboxGroup("Atividades", activities, "activities")}
            {agents && renderCheckboxGroup("Agentes", agents, "agents")}
            {entities && renderCheckboxGroup("Entidades", entities, "entities")}

            {/* Seção extra para Mapa de Calor */}
            {graphKey === "heatmap" && (
                <fieldset className="image-config-fieldset">
                    <legend>Imagem do Mapa de Fundo</legend>

                    <label>
                        <input
                            type="radio"
                            name={`image-type-${graphKey}`}
                            value="url"
                            checked={imageType === "url"}
                            onChange={(e) => {
                                setImageType("url");
                                handleImageChange("url", imageSource);
                            }}
                        />
                        URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://exemplo.com/imagem.png"
                        value={imageType === "url" ? imageSource : ""}
                        disabled={imageType !== "url"}
                        onChange={(e) => {
                            setImageSource(e.target.value);
                            handleImageChange("url", e.target.value);
                        }}
                        style={{ display: "block", width: "100%", marginTop: "0.5rem" }}
                    />

                    <label style={{ marginTop: "1rem" }}>
                        <input
                            type="radio"
                            name={`image-type-${graphKey}`}
                            value="upload"
                            checked={imageType === "upload"}
                            onChange={(e) => {
                                setImageType("upload");
                                handleImageChange("upload", "");
                            }}
                        />
                        Upload
                    </label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        disabled={imageType !== "upload"}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    setImageSource(event.target.result);
                                    handleImageChange("upload", event.target.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        style={{ display: "block", marginTop: "0.5rem" }}
                    />
                </fieldset>
            )}
        </div>
    );
}

export default GraphConfigPanel;
