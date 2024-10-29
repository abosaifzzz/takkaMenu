import React, { useState } from 'react';

const categoriesData = [
    {
        id: 1,
        title: "Pizza & Burgers",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlMyzfmXp2bWMGCMLw2JC4uXpXR1qEGTCBvw&s",
        items: [
            { id: 1, itemImg: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D", name: "Chicken", price: 50 },
            { id: 2, itemImg: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emF8ZW58MHx8MHx8fDA%3D", name: "Pizza", price: 50 },
        ],
    },
    {
        id: 2,
        title: "Sandwiches",
        image: "https://images.unsplash.com/photo-1477925518023-22b33cbd802c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        items: [
            { id: 1, itemImg: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZvb2R8ZW58MHx8MHx8fDA%3D", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "https://plus.unsplash.com/premium_photo-1673581152327-f41d5914ccc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2FuZHdpY2hlc3xlbnwwfHwwfHx8MA%3D%3D", name: "Veggie Sandwich", price: 30 },
        ],
    },
    {
        id: 3,
        title: "Deserts",
        image: "https://images.unsplash.com/photo-1518704512655-a5a68b5f0ce5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGVzc2VydHN8ZW58MHx8MHx8fDA%3D",

        items: [
            { id: 1, itemImg: "", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "", name: "Veggie Sandwich", price: 30 },
        ],
    },
    {
        id: 4,
        title: "Sandwiches",
        image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        items: [
            { id: 1, itemImg: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb2R8ZW58MHx8MHx8fDA%3D", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "", name: "Veggie Sandwich", price: 30 },
        ],
    },
    {
        id: 5,
        title: "Sandwiches",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlMyzfmXp2bWMGCMLw2JC4uXpXR1qEGTCBvw&s",
        items: [
            { id: 1, itemImg: "", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "", name: "Veggie Sandwich", price: 30 },
        ],
    },
    {
        id: 6,
        title: "Sandwiches",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlMyzfmXp2bWMGCMLw2JC4uXpXR1qEGTCBvw&s",
        items: [
            { id: 1, itemImg: "", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "", name: "Veggie Sandwich", price: 30 },
        ],
    },
    {
        id: 7,
        title: "Sandwiches",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlMyzfmXp2bWMGCMLw2JC4uXpXR1qEGTCBvw&s",
        items: [
            { id: 1, itemImg: "", name: "Turkey Sandwich", price: 40 },
            { id: 2, itemImg: "", name: "Veggie Sandwich", price: 30 },
        ],
    },
];

export default function MenuManagement() {
    const [categories, setCategories] = useState(categoriesData);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);

    const [openMenu, setOpenMenu] = useState(null);
    const [openItemMenu, setOpenItemMenu] = useState(null);

    const toggleItemMenu = (itemId) => {
        setOpenItemMenu(openItemMenu === itemId ? null : itemId);
    };

    const toggleCategoryMenu = (categoryId) => {
        setOpenMenu(openMenu === categoryId ? null : categoryId);
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };
    const toggleAddFormVisibility = () => {
        setIsAddFormVisible(!isAddFormVisible);
    };
    const toggleCategoryItems = (categoryId) => {
        setExpandedCategories((prevState) => ({
            ...prevState,
            [categoryId]: !prevState[categoryId],
        }));
    };
    const duplicateCategory = (categoryId) => {
        const categoryToDuplicate = categories.find(category => category.id === categoryId);
        const duplicatedCategory = {
            ...categoryToDuplicate,
            id: Date.now(), // Unique ID for new category
            title: `${categoryToDuplicate.title} (Copy)`,
        };
        setCategories([...categories, duplicatedCategory]);
    };

    // Delete category
    const deleteCategory = (categoryId) => {
        setCategories(categories.filter(category => category.id !== categoryId));
    };

    // Duplicate item
    const duplicateItem = (categoryId, itemId) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                const itemToDuplicate = category.items.find(item => item.id === itemId);
                const duplicatedItem = {
                    ...itemToDuplicate,
                    id: Date.now(), // Unique ID for new item
                    name: `${itemToDuplicate.name} (Copy)`,
                };
                return {
                    ...category,
                    items: [...category.items, duplicatedItem],
                };
            }
            return category;
        }));
    };

    // Delete item
    const deleteItem = (categoryId, itemId) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    items: category.items.filter(item => item.id !== itemId),
                };
            }
            return category;
        }));
    };

    return (
        <div className="menu-management relative pb-20 flex flex-col items-center">
            <div
                className={`edit-section-form fixed p-3 rounded-s-lg z-20 top-36 right-0 bottom-0 w-1/3 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out 
                ${isFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleFormVisibility} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Edit Section</p>
                </div>
                <hr className='w-full ' />
                <div className="edit-section px-2 mt-4">
                    <div className="category-name">
                        <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> Name</p>
                        <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" name="categpry-name" id="" />

                    </div>
                    <div className="category-description mt-4">
                        <p className='text-sm'> Description</p>
                        <textarea
                            rows="3"
                            style={{ resize: "none" }}
                            className="w-full text-sm mt-3 p-3 border rounded-md"
                            placeholder="Describe your category here ..."
                        ></textarea>

                    </div>
                    <div className="category-image">
                        <p className='text-sm'> Image</p>
                        <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                            <p className='mt-3'>Upload</p>
                            <p className='text-sm text-gray-500'>Only, jpg, jpeg, png files are supported</p>
                        </div>


                    </div>

                </div>
                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                    <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                    <button className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



                </div>

            </div>
            <div className={`add-section-form fixed p-3 rounded-s-lg z-20 top-36 right-0 bottom-0 w-1/3 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} `} >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleAddFormVisibility} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Add New Section</p>
                </div>
                <hr className='w-full ' />
                <div className="edit-section px-2 mt-4">
                    <div className="category-name">
                        <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> Name</p>
                        <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" name="categpry-name" id="" />

                    </div>
                    <div className="category-description mt-4">
                        <p className='text-sm'> Description</p>
                        <textarea
                            rows="3"
                            style={{ resize: "none" }}
                            className="w-full text-sm mt-3 p-3 border rounded-md"
                            placeholder="Describe your category here ..."
                        ></textarea>

                    </div>
                    <div className="category-image">
                        <p className='text-sm'> Image</p>
                        <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                            <p className='mt-3'>Upload</p>
                            <p className='text-sm text-gray-500'>Only, jpg, jpeg, png files are supported</p>
                        </div>


                    </div>

                </div>
                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                    <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                    <button className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



                </div>

            </div>
            <div className="container w-4/5 pt-3">
                <div className="live-menu shadow-md flex justify-between bg-white p-3 rounded-lg">
                    <p>Live Menu </p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" value="" />
                        <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-1 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                    </label>
                </div>
                <div className="search shadow-sm mt-4 relative"  >
                    <input className="w-full rounded-lg p-3 pl-10" type="search" placeholder="Search..." />
                    <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div onClick={toggleAddFormVisibility} className="add-category hover:bg-slate-50 cursor-pointer hover:shadow-md mt-4 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                    <p> + Add Section </p>
                </div>

                <div className="categories mt-6">
                    {categories.map((category) => (
                        <div key={category.id} className="category mt-2">
                            <div onClick={() => {
                                toggleFormVisibility();
                                toggleCategoryItems(category.id);
                                toggleCategoryMenu()

                            }} className="category-parent cursor-pointer hover:bg-slate-50 shadow-lg flex justify-between p-3 bg-white rounded-lg">
                                <div className="left flex items-center gap-2">
                                    <i className="fa-solid fa-bars text-sm text-gray-400"></i>
                                    <img className="w-10 h-10 rounded-md" src={category.image} alt={category.title} />
                                    <p>{category.title}</p>
                                </div>
                                <div className="right flex gap-4 items-center">
                                    <div className="checkbox p-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" value="" />
                                            <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                                        </label>

                                    </div>

                                    <div className="category-menu-actions relative">
                                        <i className="fa-solid fa-ellipsis-vertical px-2 text-gray-600 text-sm" onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCategoryMenu(category.id);
                                        }}></i>
                                        {openMenu === category.id && (
                                            <div className="absolute z-10 -left-12 bg-white shadow-md border rounded-md">
                                                <p className="p-2 flex text-sm items-center gap-2 pe-12 ps-3 hover:bg-gray-100" onClick={(e) => {
                                                    duplicateCategory(category.id)

                                                    e.stopPropagation();



                                                }}>
                                                    <i className="fa-regular fa-clone"></i> Duplicate
                                                </p>
                                                <p className="p-2 flex text-sm items-center gap-2 pe-12 ps-3 hover:bg-gray-100" onClick={(e) => {
                                                    deleteCategory(category.id)

                                                    e.stopPropagation();


                                                }}>
                                                    <i className="fa-regular fa-trash-can"></i> Delete
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <i className={`fa-solid fa-chevron-down cursor-pointer transform transition-transform duration-300 ${expandedCategories[category.id] ? "rotate-180" : ""}`} onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategoryItems(category.id);
                                    }}></i>
                                </div>
                            </div>

                            <div className="category-items flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out" style={{ maxHeight: expandedCategories[category.id] ? "500px" : "0px" }}>
                                {category.items.map((item) => (
                                    <div key={item.id} className="item p-2 mt-2 rounded-md w-[97%] flex justify-between bg-white">
                                        <div className="left flex items-center gap-2">
                                            <i className="fa-solid fa-bars text-sm text-gray-400"></i>
                                            <img className="w-10 h-10 rounded-md" src={item.itemImg} alt={item.name} />
                                            <p>{item.name}</p>
                                        </div>
                                        <div className="right flex gap-4 items-center">
                                            <div className="price-edit border flex p-1 rounded-md gap-2">
                                                <p>EGP</p>
                                                <input className="w-14" type="text" value={item.price} readOnly />
                                            </div>
                                            <div className="item-menu-actions relative">
                                                <i className="fa-solid fa-ellipsis-vertical cursor-pointer px-2 text-gray-600 text-sm" onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleItemMenu(item.id);
                                                }}></i>
                                                {openItemMenu === item.id && (
                                                    <div className="absolute z-10 -left-12 bg-white shadow-md border rounded-md">
                                                        <p className='p-2 flex text-sm items-center gap-2 pe-12 ps-3 hover:bg-gray-100' onClick={(e) => {
                                                            duplicateItem(category.id, item.id)
                                                            e.stopPropagation();



                                                        }}>
                                                            <i className="fa-regular fa-clone"></i> Duplicate
                                                        </p>
                                                        <p className='p-2 flex text-sm items-center gap-2 pe-12 ps-3 hover:bg-gray-100' onClick={(e) => {
                                                            deleteItem(category.id, item.id)

                                                            e.stopPropagation();



                                                        }}>
                                                            <i className="fa-regular fa-trash-can"></i> Delete
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="checkbox p-2">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" value="" />
                                                    <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                                <div className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                                    <p> + Add Item </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
