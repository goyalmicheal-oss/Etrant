'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateGroupPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        examType: '',
        examYear: new Date().getFullYear(),
        subject: '',
        isPublic: true,
        maxMembers: 100,
        tags: [] as string[],
    });
    const [tagInput, setTagInput] = useState('');

    const examTypes = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'SSC', 'Banking', 'Other'];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPublic: checked }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (formData.tags.length >= 5) {
                toast.error('Maximum 5 tags allowed');
                return;
            }
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()],
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create group');
            }

            const data = await response.json();
            toast.success('Group created successfully!');
            router.push(`/groups/${data.group.id}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/groups">
                <Button variant="ghost" className="mb-4 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Groups
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create Study Group</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., JEE Advanced 2025 Physics"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                maxLength={100}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What is this group about?"
                                value={formData.description}
                                onChange={handleInputChange}
                                maxLength={500}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Exam Type */}
                            <div className="space-y-2">
                                <Label htmlFor="examType">Exam Type</Label>
                                <select
                                    id="examType"
                                    name="examType"
                                    value={formData.examType}
                                    onChange={handleInputChange}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Exam</option>
                                    {examTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Exam Year */}
                            <div className="space-y-2">
                                <Label htmlFor="examYear">Target Year</Label>
                                <Input
                                    id="examYear"
                                    name="examYear"
                                    type="number"
                                    min={new Date().getFullYear()}
                                    max={new Date().getFullYear() + 5}
                                    value={formData.examYear}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Subject */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject (Optional)</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="e.g., Mathematics"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Max Members */}
                            <div className="space-y-2">
                                <Label htmlFor="maxMembers">Max Members</Label>
                                <Input
                                    id="maxMembers"
                                    name="maxMembers"
                                    type="number"
                                    min={2}
                                    max={1000}
                                    value={formData.maxMembers}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add tags..."
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-destructive"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Privacy Toggle */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Public Group</Label>
                                <p className="text-sm text-muted-foreground">
                                    Anyone can search and join this group
                                </p>
                            </div>
                            <Switch
                                checked={formData.isPublic}
                                onCheckedChange={handleSwitchChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Group'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
